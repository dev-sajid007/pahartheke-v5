import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  console.log("Connected to MongoDB");

  // ============== Fetch API data ==============
  console.log("\n=== Fetching API data ===");
  const [custRes, prodRes] = await Promise.all([
    fetch("https://pahartheke.com/mcp-api/v1/customers"),
    fetch("https://pahartheke.com/mcp-api/v1/products"),
  ]);
  const custJson = await custRes.json();
  const prodJson = await prodRes.json();
  const apiCustomers = custJson.data || [];
  const apiProducts = prodJson.data || [];

  const ordersJson = JSON.parse(fs.readFileSync("/tmp/orders.json", "utf-8"));
  const apiOrders = ordersJson.data || [];
  console.log(`Customers: ${apiCustomers.length}, Products: ${apiProducts.length}, Orders: ${apiOrders.length}`);

  // ============== Build customer user_id -> _id map from DB ==============
  console.log("\n=== Building customer mapping ===");
  const allCustomers = await db.collection("customers").find({}, {
    projection: { _id: 1, phone: 1 }
  }).toArray();
  console.log(`Found ${allCustomers.length} customers in DB`);

  // Build phone -> _id map
  const phoneToId = new Map();
  for (const c of allCustomers) {
    phoneToId.set(c.phone, c._id.toString());
  }

  // Build user_id -> _id map using API customers
  const userIdToPosId = new Map();
  for (const c of apiCustomers) {
    const user = c.user;
    if (!user) continue;
    let phone = user.phone ? user.phone.replace(/[^0-9+]/g, "") : "";
    if (!phone) phone = `019${String(c.id).padStart(7, "0")}`;
    if (phone.startsWith("+880")) phone = "0" + phone.slice(4);
    if (!phone.startsWith("01")) phone = "01" + phone;

    if (phoneToId.has(phone)) {
      userIdToPosId.set(user.id, phoneToId.get(phone));
    }
  }
  console.log(`Mapped ${userIdToPosId.size} user IDs`);

  // ============== Build product mapping ==============
  console.log("\n=== Building product mapping ===");
  const posProducts = await db.collection("products").find({}).toArray();
  const productNameMap = new Map();
  for (const p of posProducts) {
    productNameMap.set(p.name.trim().toLowerCase().replace(/\s+/g, " "), p);
  }

  const apiProductMap = new Map();
  for (const p of apiProducts) {
    apiProductMap.set(p.id, p);
  }
  console.log(`Mapped ${posProducts.length} products`);

  // ============== Get admin user ==============
  const adminUser = await db.collection("users").findOne({ role: "admin" });
  const defaultSoldBy = adminUser ? adminUser._id : undefined;

  // ============== Bulk Insert Sales ==============
  console.log("\n=== Importing orders (bulk) ===");

  const saleOps = [];
  let saleSkipped = 0, noItems = 0;

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

    if (items.length === 0) { saleSkipped++; noItems++; continue; }

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

  console.log(`Prepared ${saleOps.length} order upserts (${saleSkipped} skipped, ${noItems} no matching items)`);

  let saleCreated = 0;
  for (let i = 0; i < saleOps.length; i += 1000) {
    const batch = saleOps.slice(i, i + 1000);
    const result = await db.collection("sales").bulkWrite(batch, { ordered: false });
    saleCreated += result.upsertedCount;
    console.log(`  ${Math.min(i + 1000, saleOps.length)}/${saleOps.length} orders (${saleCreated} created)...`);
  }

  console.log(`\nOrders done. ${saleCreated} created.`);

  // ============== Update customer stats ==============
  console.log("\n=== Updating customer stats ===");
  const stats = await db.collection("sales").aggregate([
    { $group: { _id: "$customer", totalSpent: { $sum: "$grandTotal" }, totalOrders: { $sum: 1 } } },
  ]).toArray();

  const statOps = stats.filter(s => s._id).map(s => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(s._id) },
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
