import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;

async function main() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  console.log("Connected to MongoDB");

  // ============== Fetch API data ==============
  console.log("\n=== Fetching data from APIs ===");
  const [custRes, prodRes] = await Promise.all([
    fetch("https://pahartheke.com/mcp-api/v1/customers"),
    fetch("https://pahartheke.com/mcp-api/v1/products"),
  ]);
  const custJson = await custRes.json();
  const prodJson = await prodRes.json();
  const apiCustomers = custJson.data || [];
  const apiProducts = prodJson.data || [];
  console.log(`Customers: ${apiCustomers.length}, Products: ${apiProducts.length}`);

  const ordersJson = JSON.parse(fs.readFileSync("/tmp/orders.json", "utf-8"));
  const apiOrders = ordersJson.data || [];
  console.log(`Orders: ${apiOrders.length}`);

  // ============== Get POS products ==============
  const posProducts = await db.collection("products").find({}).toArray();
  console.log(`POS products: ${posProducts.length}`);

  // Build name -> POS product map
  const productNameMap = new Map();
  for (const p of posProducts) {
    productNameMap.set(p.name.trim().toLowerCase().replace(/\s+/g, " "), p);
  }

  // Build API product id -> product info map
  const apiProductMap = new Map();
  for (const p of apiProducts) {
    apiProductMap.set(p.id, p);
  }

  // ============== Bulk Insert Customers ==============
  console.log("\n=== Importing customers (bulk) ===");
  const custOps = [];
  const userIdToPosId = new Map();
  let skipped = 0;

  for (const c of apiCustomers) {
    const user = c.user;
    if (!user) { skipped++; continue; }

    const name = (user.name || "Unknown").trim() || "Unknown";
    let phone = user.phone ? user.phone.replace(/[^0-9+]/g, "") : "";
    if (!phone) phone = `019${String(c.id).padStart(7, "0")}`;
    if (phone.startsWith("+880")) phone = "0" + phone.slice(4);
    if (!phone.startsWith("01")) phone = "01" + phone;

    const email = user.email || "";
    const addrParts = [user.address, user.city, user.country].filter(Boolean);
    const address = addrParts.join(", ");

    custOps.push({
      updateOne: {
        filter: { phone },
        update: {
          $setOnInsert: {
            name, phone, email, address,
            previousDue: 0, totalSpent: 0, totalOrders: 0,
            loyaltyPoints: 0, status: true,
            createdAt: new Date(), updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    });
  }

  // Execute in batches of 1000
  let inserted = 0;
  for (let i = 0; i < custOps.length; i += 1000) {
    const batch = custOps.slice(i, i + 1000);
    const result = await db.collection("customers").bulkWrite(batch, { ordered: false });
    inserted += result.upsertedCount + (result.modifiedCount || 0);
    if ((i + 1000) % 5000 === 0 || i + 1000 >= custOps.length) {
      console.log(`  ${Math.min(i + 1000, custOps.length)}/${custOps.length} customers processed...`);
    }
  }

  // Build user_id -> customer _id map
  for (const c of apiCustomers) {
    const user = c.user;
    if (!user) continue;
    let phone = user.phone ? user.phone.replace(/[^0-9+]/g, "") : "";
    if (!phone) phone = `019${String(c.id).padStart(7, "0")}`;
    if (phone.startsWith("+880")) phone = "0" + phone.slice(4);
    if (!phone.startsWith("01")) phone = "01" + phone;

    const found = await db.collection("customers").findOne({ phone }, { projection: { _id: 1 } });
    if (found) {
      userIdToPosId.set(user.id, found._id.toString());
    }
  }

  console.log(`Customers done. ${inserted} upserted. Mapped ${userIdToPosId.size} user IDs.`);

  // ============== Bulk Insert Sales ==============
  console.log("\n=== Importing orders (bulk) ===");

  // Get admin user
  const adminUser = await db.collection("users").findOne({ role: "admin" });
  const defaultSoldBy = adminUser ? adminUser._id : undefined;

  const saleOps = [];
  let saleSkipped = 0;

  for (const o of apiOrders) {
    if (o.cancelled) { saleSkipped++; continue; }

    let customerId = null;
    if (o.user_id && userIdToPosId.has(o.user_id)) {
      customerId = userIdToPosId.get(o.user_id);
    }

    const details = o.orderDetails || [];
    const items = [];
    let subtotal = 0, totalCost = 0, totalProfit = 0;

    for (const d of details) {
      const apiProd = apiProductMap.get(d.product_id);
      if (!apiProd) continue;

      const pName = apiProd.name.trim().toLowerCase().replace(/\s+/g, " ");
      const posProduct = productNameMap.get(pName);
      if (!posProduct) continue;

      const quantity = d.quantity || 1;
      const salePrice = d.price || 0;
      const cost = posProduct.purchasePrice || salePrice * 0.6 || 0;
      const itemSubtotal = quantity * salePrice;
      const profit = (salePrice - cost) * quantity;

      items.push({
        product: posProduct._id,
        quantity,
        salePrice,
        subtotal: itemSubtotal,
        cost: cost * quantity,
        profit,
      });
      subtotal += itemSubtotal;
      totalCost += cost * quantity;
      totalProfit += profit;
    }

    if (items.length === 0) { saleSkipped++; continue; }

    const discount = parseFloat(o.total_discount) || 0;
    const shippingCost = details.length > 0 ? (details[0].shipping_cost || 0) : 0;
    const grandTotal = o.grand_total || subtotal - discount;
    const paidAmount = o.payment_status === "paid" ? grandTotal : 0;
    const dueAmount = grandTotal - paidAmount;

    let orderDate = new Date();
    if (o.date) orderDate = new Date(o.date * 1000);
    else if (o.created_at) orderDate = new Date(o.created_at);

    const source = o.pos_order ? "pos" : "website";

    saleOps.push({
      updateOne: {
        filter: { invoiceNo: o.code },
        update: {
          $setOnInsert: {
            invoiceNo: o.code,
            customer: customerId || null,
            items,
            subtotal,
            shippingCost,
            discount,
            grandTotal,
            paidAmount,
            dueAmount,
            totalCost,
            totalProfit,
            source,
            note: o.order_note || "",
            soldBy: defaultSoldBy || null,
            order_date: orderDate,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    });
  }

  console.log(`Prepared ${saleOps.length} order upserts (${saleSkipped} skipped)`);

  let saleCreated = 0;
  for (let i = 0; i < saleOps.length; i += 1000) {
    const batch = saleOps.slice(i, i + 1000);
    const result = await db.collection("sales").bulkWrite(batch, { ordered: false });
    saleCreated += result.upsertedCount;
    if ((i + 1000) % 5000 === 0 || i + 1000 >= saleOps.length) {
      console.log(`  ${Math.min(i + 1000, saleOps.length)}/${saleOps.length} orders processed...`);
    }
  }

  console.log(`Orders done. ${saleCreated} created.`);

  // ============== Update customer stats ==============
  console.log("\n=== Updating customer stats ===");
  const stats = await db.collection("sales").aggregate([
    { $group: { _id: "$customer", totalSpent: { $sum: "$grandTotal" }, totalOrders: { $sum: 1 } } },
  ]).toArray();

  const statOps = stats.filter(s => s._id).map(s => ({
    updateOne: {
      filter: { _id: s._id },
      update: { $set: { totalSpent: s.totalSpent, totalOrders: s.totalOrders } },
    },
  }));

  if (statOps.length > 0) {
    await db.collection("customers").bulkWrite(statOps, { ordered: false });
  }
  console.log(`Updated ${statOps.length} customer stats`);

  // ============== Summary ==============
  const finalCust = await db.collection("customers").countDocuments({});
  const finalSales = await db.collection("sales").countDocuments({});
  console.log(`\n=== Final Summary ===`);
  console.log(`Customers: ${finalCust}`);
  console.log(`Orders: ${finalSales}`);

  await mongoose.disconnect();
  console.log("Done!");
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
