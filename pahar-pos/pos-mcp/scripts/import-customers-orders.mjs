import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// --- Schemas ---
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, default: "" },
  address: { type: String, default: "" },
  previousDue: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  badge: { type: mongoose.Schema.Types.ObjectId, ref: "Badge" },
  loyaltyPoints: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

const saleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: { type: String },
  variantName: { type: String },
  quantity: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  cost: { type: Number, required: true },
  profit: { type: Number, required: true },
}, { _id: false });

const saleSchema = new mongoose.Schema({
  invoiceNo: { type: String, unique: true, sparse: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  items: [saleItemSchema],
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  badgeName: { type: String },
  badgeDiscount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  totalCost: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
  source: { type: String, enum: ["pos", "website"], default: "pos" },
  note: { type: String, default: "" },
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  order_date: { type: Date, default: Date.now },
}, { timestamps: true });

const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);

const productSchema = new mongoose.Schema({
  name: String,
  sku: { type: String, unique: true, sparse: true },
  purchasePrice: Number,
  salePrice: Number,
  currentStock: Number,
});
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // ============== STEP 1: Fetch API data ==============
  console.log("\n=== Fetching customers from API ===");
  const custRes = await fetch("https://pahartheke.com/mcp-api/v1/customers");
  const custData = await custRes.json();
  const apiCustomers = custData.data || [];
  console.log(`Fetched ${apiCustomers.length} customers`);

  console.log("\n=== Loading orders from file ===");
  const fs = await import("fs");
  const ordersJson = JSON.parse(fs.readFileSync("/tmp/orders.json", "utf-8"));
  const apiOrders = ordersJson.data || [];
  console.log(`Loaded ${apiOrders.length} orders`);

  // ============== STEP 2: Get existing POS products ==============
  console.log("\n=== Mapping API products to POS products ===");
  const posProducts = await Product.find({}).lean();
  console.log(`Found ${posProducts.length} POS products`);

  // Build a mapping: API product name -> POS product
  // Normalize names for matching
  const productNameMap = new Map();
  for (const p of posProducts) {
    const key = p.name.trim().toLowerCase().replace(/\s+/g, " ");
    productNameMap.set(key, p);
  }

  // First, get all API products to map IDs to names
  const prodRes = await fetch("https://pahartheke.com/mcp-api/v1/products");
  const prodData = await prodRes.json();
  const apiProducts = prodData.data || [];
  const apiProductMap = new Map();
  for (const p of apiProducts) {
    apiProductMap.set(p.id, p);
  }
  console.log(`Fetched ${apiProducts.length} API products for ID mapping`);

  // ============== STEP 3: Import customers ==============
  console.log("\n=== Importing customers ===");
  let custCreated = 0, custSkipped = 0;
  const userIdToPosId = new Map(); // API user_id -> POS customer _id

  for (const c of apiCustomers) {
    const user = c.user;
    if (!user) { custSkipped++; continue; }

    const name = user.name || "Unknown";
    let phone = user.phone;
    if (!phone) phone = `019${String(c.id).padStart(7, "0")}`;
    // Clean phone
    phone = phone.replace(/[^0-9+]/g, "");
    if (phone.startsWith("+880")) phone = "0" + phone.slice(4);
    if (!phone.startsWith("01")) phone = "01" + phone;

    const email = user.email || "";
    const addrParts = [user.address, user.city, user.country].filter(Boolean);
    const address = addrParts.join(", ");

    try {
      const doc = await Customer.create({
        name,
        phone,
        email,
        address,
        totalOrders: 0,
        totalSpent: 0,
      });
      userIdToPosId.set(user.id, doc._id.toString());
      custCreated++;
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate phone - try to find existing
        const existing = await Customer.findOne({ phone });
        if (existing) {
          userIdToPosId.set(user.id, existing._id.toString());
        }
        custSkipped++;
      } else {
        console.error(`  ERROR customer ${name}: ${err.message}`);
        custSkipped++;
      }
    }

    if (custCreated % 500 === 0) {
      console.log(`  ${custCreated} customers created...`);
      await sleep(100); // small breather
    }
  }
  console.log(`Customers: ${custCreated} created, ${custSkipped} skipped`);

  // Save mapping for orders step

  // ============== STEP 4: Import orders ==============
  console.log("\n=== Importing orders ===");
  let saleCreated = 0, saleSkipped = 0;

  // Get one admin user for soldBy
  const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
    name: String,
    email: String,
    role: String,
  }));
  const adminUser = await User.findOne({ role: "admin" }).lean();
  const defaultSoldBy = adminUser ? adminUser._id : undefined;

  for (const o of apiOrders) {
    // Skip cancelled orders
    if (o.cancelled) { saleSkipped++; continue; }

    // Map customer
    let customerId = null;
    if (o.user_id && userIdToPosId.has(o.user_id)) {
      customerId = userIdToPosId.get(o.user_id);
    } else if (o.guest_id && userIdToPosId.has(o.guest_id)) {
      customerId = userIdToPosId.get(o.guest_id);
    }

    // Parse shipping address for guest info
    let shippingName = "", shippingEmail = "", shippingPhone = "";
    if (o.shipping_address) {
      try {
        const sa = JSON.parse(o.shipping_address);
        shippingName = sa.name || "";
        shippingEmail = sa.email || "";
        shippingPhone = (sa.phone || "").replace(/[^0-9+]/g, "");
      } catch (e) { /* ignore parse errors */ }
    }

    // Build items
    const items = [];
    let subtotal = 0;
    let totalCost = 0;
    let totalProfit = 0;

    const details = o.orderDetails || [];
    for (const d of details) {
      const apiProd = apiProductMap.get(d.product_id);
      if (!apiProd) continue;

      // Match product by name
      const pName = apiProd.name.trim().toLowerCase().replace(/\s+/g, " ");
      const posProduct = productNameMap.get(pName);
      if (!posProduct) continue;

      const quantity = d.quantity || 1;
      const salePrice = d.price || 0;
      const cost = posProduct.purchasePrice || d.price * 0.6 || 0;
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

    if (items.length === 0) {
      saleSkipped++;
      continue;
    }

    // Calculate amounts
    const discount = parseFloat(o.total_discount) || 0;
    const shippingCost = details.length > 0 ? (details[0].shipping_cost || 0) : 0;
    const grandTotal = o.grand_total || subtotal - discount;
    const paidAmount = o.payment_status === "paid" ? grandTotal : 0;
    const dueAmount = grandTotal - paidAmount;

    // Order date
    let orderDate = new Date();
    if (o.date) {
      orderDate = new Date(o.date * 1000);
    } else if (o.created_at) {
      orderDate = new Date(o.created_at);
    }

    const source = o.pos_order ? "pos" : "website";

    try {
      await Sale.create({
        invoiceNo: o.code,
        customer: customerId,
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
        soldBy: defaultSoldBy,
        order_date: orderDate,
      });
      saleCreated++;
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate invoice
        saleSkipped++;
      } else {
        console.error(`  ERROR order ${o.code}: ${err.message}`);
        saleSkipped++;
      }
    }

    if (saleCreated % 1000 === 0) {
      console.log(`  ${saleCreated} orders created...`);
      await sleep(50);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Customers: ${custCreated} created, ${custSkipped} skipped`);
  console.log(`Orders: ${saleCreated} created, ${saleSkipped} skipped`);

  // Update customer stats
  console.log("\n=== Updating customer stats ===");
  const stats = await Sale.aggregate([
    { $group: {
      _id: "$customer",
      totalSpent: { $sum: "$grandTotal" },
      totalOrders: { $sum: 1 },
    }}
  ]);
  for (const s of stats) {
    if (s._id) {
      await Customer.findByIdAndUpdate(s._id, {
        totalSpent: s.totalSpent,
        totalOrders: s.totalOrders,
      });
    }
  }
  console.log(`Updated ${stats.length} customer stats`);

  await mongoose.disconnect();
  console.log("Done!");
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
