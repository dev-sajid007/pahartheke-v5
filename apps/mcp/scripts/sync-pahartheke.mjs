import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://dev_sajid:sajid789@cluster0.ks51z.mongodb.net/pahar-pos";
const API_BASE = "https://pahartheke.com/mcp-api/v1";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");
}

async function fetchAPI(endpoint) {
  const res = await fetch(`${API_BASE}/${endpoint}`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.data || []);
}

// ── Schemas ──
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  status: { type: Boolean, default: true },
}, { timestamps: true });
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true, sparse: true },
  barcode: { type: String, default: "" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  purchasePrice: { type: Number, default: 0 },
  salePrice: { type: Number, default: 0 },
  currentStock: { type: Number, default: 0 },
  unit: { type: String, default: "piece" },
  productType: { type: String, enum: ["weight", "piece", "packet", "bundle"], default: "piece" },
  image: { type: String, default: "" },
  status: { type: Boolean, default: true },
}, { timestamps: true });
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  address: { type: String, default: "" },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  previousDue: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
}, { timestamps: true });
const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

// ── Sale Schema ──
const saleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  variantId: { type: String },
  variantName: { type: String },
  quantity: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  cost: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
}, { _id: false });

const saleSchema = new mongoose.Schema({
  invoiceNo: { type: String },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  items: [saleItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  source: { type: String, default: "website" },
  createdAt: { type: Date },
}, { timestamps: false });
const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);

// ── Sync Functions ──

async function syncCategories() {
  console.log("\n📦 Syncing categories...");
  const items = await fetchAPI("categories");
  let created = 0, skipped = 0;

  for (const cat of items) {
    const name = cat.name?.trim();
    if (!name) { skipped++; continue; }
    const exists = await Category.findOne({ name });
    if (exists) { skipped++; continue; }
    const slug = cat.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await Category.create({
      name,
      slug,
      image: cat.banner ? `https://pahartheke.com/uploads/${cat.banner}` : "",
      status: cat.featured ? true : false,
    });
    created++;
  }
  console.log(`  ✅ ${created} created, ${skipped} skipped (${items.length} total)`);
}

async function syncProducts() {
  console.log("\n📦 Syncing products...");
  const items = await fetchAPI("products");
  let created = 0, skipped = 0;
  const catList = await Category.find({}).lean();
  const catMap = {};
  for (const c of catList) catMap[c.name.toLowerCase()] = c._id;

  for (const p of items) {
    const name = p.name?.trim();
    if (!name) { skipped++; continue; }
    const sku = `PT-${p.id}`;
    const exists = await Product.findOne({ sku });
    if (exists) { skipped++; continue; }
    await Product.create({
      name,
      sku,
      barcode: p.barcode || sku || `barcode-${p.id}`, // Use SKU as fallback to avoid duplicates
      category: catMap[p.category_name?.toLowerCase()] || null,
      purchasePrice: p.purchase_price || 0,
      salePrice: p.unit_price || 0,
      currentStock: p.current_stock || p.stock || 0,
      image: p.thumbnail_img ? `https://pahartheke.com/uploads/${p.thumbnail_img}` : "",
      status: p.status !== 0,
    });
    created++;
  }
  console.log(`  ✅ ${created} created, ${skipped} skipped (${items.length} total)`);
}

async function syncCustomers() {
  console.log("\n👥 Syncing customers (batch)...");
  const items = await fetchAPI("customers");
  let created = 0, skipped = 0;
  const batch = [];

  for (const c of items) {
    const user = c.user || {};
    const name = user.name?.trim();
    const phone = user.phone || "";
    if (!name) { skipped++; continue; }
    batch.push({
      name,
      phone,
      email: user.email || "",
      totalOrders: c.total_orders || 0,
      totalSpent: c.total_amount || 0,
    });
    created++;
  }

  // Bulk insert in batches of 500
  for (let i = 0; i < batch.length; i += 500) {
    const chunk = batch.slice(i, i + 500);
    await Customer.insertMany(chunk, { ordered: false }).catch(() => {});
    if ((i + 500) % 2000 === 0 || i + 500 >= batch.length) {
      console.log(`  Progress: ${Math.min(i + 500, batch.length)} / ${batch.length}`);
    }
  }
  console.log(`  ✅ ${created} created, ${skipped} skipped (${items.length} total)`);
}

// ── Main ──

async function syncOrders() {
  console.log("\n📋 Syncing orders (batch)...");
  const items = await fetchAPI("orders");
  let created = 0, skipped = 0;
  const batch = [];

  // Load product SKU → ID map
  const products = await Product.find({}).lean();
  const prodMap = {};
  for (const p of products) if (p.sku) prodMap[p.sku] = p._id;

  // Load customer phone → ID map  
  const customers = await Customer.find({}).lean();
  const custMap = {};
  for (const c of customers) if (c.phone) custMap[c.phone] = c._id;

  for (const o of items) {
    const addr = (() => { try { return JSON.parse(o.shipping_address || "{}"); } catch { return {}; } })();
    const invoiceNo = `PT-${o.id}`;
    const details = o.orderDetails || [];
    if (details.length === 0) { skipped++; continue; }

    const saleItems = [];
    let subtotal = 0;
    for (const d of details) {
      const prodSku = `PT-${d.product_id}`;
      const prodId = prodMap[prodSku];
      const qty = d.quantity || 1;
      const price = d.price || 0;
      const itemSubtotal = qty * price;
      subtotal += itemSubtotal;
      saleItems.push({
        product: prodId || undefined,
        variantId: d.variant ? String(d.variant) : undefined,
        quantity: qty,
        salePrice: price,
        subtotal: itemSubtotal,
        cost: 0,
        profit: itemSubtotal,
      });
    }

    const customerPhone = addr.phone || "";
    const customerId = custMap[customerPhone] || undefined;

    batch.push({
      invoiceNo,
      customer: customerId,
      items: saleItems,
      subtotal,
      discount: o.total_discount || o.badge_discount || 0,
      grandTotal: o.grand_total || subtotal,
      paidAmount: o.grand_total || subtotal,
      dueAmount: 0,
      totalCost: 0,
      totalProfit: subtotal,
      source: "website",
      createdAt: o.created_at ? new Date(o.created_at) : new Date(),
    });
    created++;
  }

  // Bulk insert in batches of 500
  for (let i = 0; i < batch.length; i += 500) {
    const chunk = batch.slice(i, i + 500);
    await Sale.insertMany(chunk, { ordered: false }).catch(() => {});
    if ((i + 500) % 2000 === 0 || i + 500 >= batch.length) {
      console.log(`  Progress: ${Math.min(i + 500, batch.length)} / ${batch.length}`);
    }
  }
  console.log(`  ✅ ${created} synced, ${skipped} skipped (${items.length} total)`);
}

async function main() {
  console.log("🚀 Pahartheke → Pahar POS Sync");
  console.log("═══════════════════════════════");
  await connectDB();
  await syncCategories();
  await syncProducts();
  await syncCustomers();
  await syncOrders();
  console.log("\n✅ Sync complete!");
  await mongoose.disconnect();
}

main().catch(err => {
  console.error("❌ Sync failed:", err.message);
  process.exit(1);
});
