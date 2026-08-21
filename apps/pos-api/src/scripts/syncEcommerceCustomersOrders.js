import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import Customer from "../modules/customer/customer.model.js";
import Product from "../modules/product/product.model.js";
import Sale from "../modules/sale/sale.model.js";

const CUSTOMERS_API =
  process.env.EXTERNAL_ECOMMERCE_CUSTOMERS_API ||
  "https://www.pahartheke.com/mcp-api/v1/customers";

const ORDERS_API =
  process.env.EXTERNAL_ECOMMERCE_ORDERS_API ||
  "https://www.pahartheke.com/mcp-api/v1/orders";

const fetchJson = async (url) => {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`${url} responded with status ${res.status}`);
  }
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
};

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const composeAddress = (shipping) => {
  return [shipping.address, shipping.city, shipping.postal_code, shipping.country]
    .filter(Boolean)
    .map((part) => String(part).trim())
    .filter(Boolean)
    .join(", ");
};

const cleanPaymentType = (type) => {
  const value = String(type || "").toLowerCase();
  if (!value) return "cash_on_delivery";
  if (value.includes("xor") || value.includes("select") || value.includes("waitfor") || value.includes(";")) {
    return "other";
  }
  if (value === "cash") return "cash";
  if (value.includes("cash_on_delivery") || value === "cod") return "cash_on_delivery";
  return "online";
};

const parseShipping = (raw) => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const importCustomers = async () => {
  const externalCustomers = await fetchJson(CUSTOMERS_API);
  console.log(`Fetched ${externalCustomers.length} customers from API`);

  const seenPhones = new Set();
  const phoneToId = new Map();
  const userToPhone = new Map();
  const ops = [];

  for (const c of externalCustomers) {
    const user = c.user || {};
    const phone = String(user.phone || "").trim();
    if (!phone) continue;

    const userId = user.id ?? c.user_id;
    if (userId != null) {
      userToPhone.set(String(userId), phone);
    }

    if (seenPhones.has(phone)) continue;
    seenPhones.add(phone);

    const name = String(user.name || "").trim() || `Customer ${phone}`;
    const address = composeAddress(user);

    ops.push({
      updateOne: {
        filter: { phone },
        update: {
          $set: {
            name,
            phone,
            email: String(user.email || "").trim(),
            address,
            status: true,
          },
        },
        upsert: true,
      },
    });
  }

  let customerCreated = 0;
  let customerUpdated = 0;
  for (let i = 0; i < ops.length; i += 500) {
    const chunk = ops.slice(i, i + 500);
    const result = await Customer.bulkWrite(chunk, { ordered: false });
    customerCreated += result.upsertedCount;
    customerUpdated += result.modifiedCount;
  }

  const customers = await Customer.find({ phone: { $in: [...seenPhones] } }).select("_id phone");
  for (const doc of customers) {
    phoneToId.set(doc.phone, doc._id);
  }

  return { userToPhone, phoneToId, customerCreated, customerUpdated };
};

const ensurePlaceholderProducts = async (externalOrders) => {
  const neededIds = new Set();
  for (const o of externalOrders) {
    for (const od of o.orderDetails || []) {
      if (od.product_id) neededIds.add(Number(od.product_id));
    }
  }

  const missing = [];

  const productDocs = await Product.find({ sku: { $in: [...neededIds].map((id) => `EXT-${id}`) } }).select("_id sku purchasePrice salePrice");
  const productBySku = new Map();
  for (const doc of productDocs) {
    productBySku.set(doc.sku, doc);
  }

  return { missing, placeholderCreated: 0, productBySku };
};

const importOrders = async (externalOrders, { userToPhone, phoneToId, productBySku }) => {
  const seenCodes = new Set();
  const ops = [];
  let orderSkipped = 0;
  let unmappedLines = 0;

  for (const o of externalOrders) {
    if (o.cancelled === 1) {
      orderSkipped++;
      continue;
    }

    const details = o.orderDetails || [];
    if (details.length === 0) {
      orderSkipped++;
      continue;
    }

    const shipping = parseShipping(o.shipping_address);

    const items = [];
    let subtotal = 0;
    let shippingCost = 0;
    let totalCost = 0;
    let totalProfit = 0;
    let valid = true;

    for (const od of details) {
      const product = productBySku.get(`EXT-${od.product_id}`);
      if (!product) {
        unmappedLines++;
        valid = false;
        break;
      }

      const quantity = toNumber(od.quantity);
      const price = toNumber(od.price);
      const lineSubtotal = quantity * price;
      const lineDiscount = toNumber(od.discount);
      const itemSubtotal = Math.max(lineSubtotal - lineDiscount, 0);

      let cost;
      let profit;
      const legacyProfit = toNumber(od.profit);
      if (Number.isFinite(Number(od.profit)) && legacyProfit !== 0) {
        profit = legacyProfit;
        cost = Math.max(lineSubtotal - legacyProfit, 0);
      } else {
        cost = quantity * (product.purchasePrice || 0);
        profit = lineSubtotal - cost;
      }

      items.push({
        product: product._id,
        quantity,
        salePrice: price,
        subtotal: itemSubtotal,
        cost,
        profit,
      });

      subtotal += itemSubtotal;
      shippingCost += toNumber(od.shipping_cost);
      totalCost += cost;
      totalProfit += profit;
    }

    if (!valid || items.length === 0) {
      orderSkipped++;
      continue;
    }

    const grandTotal = toNumber(o.grand_total);
    const discount =
      toNumber(o.total_discount) +
      toNumber(o.badge_discount) +
      toNumber(o.coupon_discount);

    const paid =
      o.payment_status === "paid" || o.payment_status === "advance";

    const phone = String(shipping.phone || "").trim() || userToPhone.get(String(o.user_id)) || "";
    const customerId = phoneToId.get(phone) || null;

    let invoiceNo = String(o.code || "").trim();
    if (!invoiceNo) {
      invoiceNo = `LEGACY-${o.id}`;
    } else if (seenCodes.has(invoiceNo)) {
      invoiceNo = `${invoiceNo}-${o.id}`;
    }
    seenCodes.add(invoiceNo);

    ops.push({
      updateOne: {
        filter: { externalOrderId: `EXT-ORDER-${o.id}` },
        update: {
          $set: {
            externalOrderId: `EXT-ORDER-${o.id}`,
            invoiceNo,
            customer: customerId,
            customerName: String(shipping.name || "").trim(),
            customerPhone: phone,
            customerEmail: String(shipping.email || "").trim(),
            customerAddress: String(shipping.address || "").trim(),
            customerCity: String(shipping.city || "").trim(),
            paymentType: cleanPaymentType(o.payment_type),
            items,
            subtotal: Number(subtotal.toFixed(2)),
            shippingCost: Number(shippingCost.toFixed(2)),
            discount: Number(discount.toFixed(2)),
            grandTotal: Number(grandTotal.toFixed(2)),
            paidAmount: paid ? grandTotal : 0,
            dueAmount: paid ? 0 : grandTotal,
            totalCost: Number(totalCost.toFixed(2)),
            totalProfit: Number(totalProfit.toFixed(2)),
            source: o.pos_order === 1 ? "pos" : "website",
            note: String(o.order_note || "").trim(),
            order_date: o.date ? new Date(o.date * 1000) : new Date(o.created_at || Date.now()),
          },
        },
        upsert: true,
      },
    });
  }

  let orderCreated = 0;
  let orderUpdated = 0;
  for (let i = 0; i < ops.length; i += 500) {
    const chunk = ops.slice(i, i + 500);
    const result = await Sale.bulkWrite(chunk, { ordered: false });
    orderCreated += result.upsertedCount;
    orderUpdated += result.modifiedCount;
  }

  return { orderCreated, orderUpdated, orderSkipped, unmappedLines };
};

const updateCustomerTotals = async () => {
  const rows = await Sale.aggregate([
    { $match: { customer: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: "$customer",
        totalSpent: { $sum: "$grandTotal" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const ops = rows.map((row) => ({
    updateOne: {
      filter: { _id: row._id },
      update: {
        $set: { totalSpent: Number(row.totalSpent.toFixed(2)), totalOrders: row.totalOrders },
      },
    },
  }));

  let updated = 0;
  for (let i = 0; i < ops.length; i += 500) {
    const result = await Customer.bulkWrite(ops.slice(i, i + 500), { ordered: false });
    updated += result.modifiedCount;
  }
  return updated;
};

const syncCustomersOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const { userToPhone, phoneToId, customerCreated, customerUpdated } = await importCustomers();
    console.log(
      `Customers done. created=${customerCreated} updated=${customerUpdated}`
    );

    const externalOrders = await fetchJson(ORDERS_API);
    console.log(`Fetched ${externalOrders.length} orders from API`);

    const { missing, placeholderCreated, productBySku } = await ensurePlaceholderProducts(externalOrders);
    console.log(
      `Placeholder products created=${placeholderCreated} (missing legacy ids: ${missing.length})`
    );

    const result = await importOrders(externalOrders, { userToPhone, phoneToId, productBySku });
    console.log(
      `Orders done. created=${result.orderCreated} updated=${result.orderUpdated} skipped=${result.orderSkipped} unmappedLines=${result.unmappedLines}`
    );

    const totalsUpdated = await updateCustomerTotals();
    console.log(`Customer totals updated=${totalsUpdated}`);
  } catch (error) {
    console.error("Sync failed:", error);
  } finally {
    await mongoose.connection.close();
  }
};

syncCustomersOrders();
