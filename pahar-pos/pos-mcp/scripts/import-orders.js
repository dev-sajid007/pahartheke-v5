import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const ORDERS_API = "https://pahartheke.com/mcp-api/v1/orders";
const PRODUCTS_API = "https://pahartheke.com/mcp-api/v1/products";

// ─── Mongoose Setup ──────────────────────────────────────────
const saleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  cost: { type: Number, required: true },
  profit: { type: Number, required: true },
}, { _id: false });

const saleSchema = new mongoose.Schema({
  invoiceNo: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  items: [saleItemSchema],
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  badgeDiscount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  totalCost: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
  source: { type: String, enum: ["pos", "website"], default: "pos" },
  note: { type: String, default: "" },
}, { timestamps: true });

// ─── Helpers ────────────────────────────────────────────────
function cleanPhone(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("880") && cleaned.length > 11) cleaned = "0" + cleaned.slice(3);
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    if (cleaned.length === 10 && !cleaned.startsWith("0")) cleaned = "0" + cleaned;
    return cleaned;
  }
  return null;
}

function normalizeProductName(name) {
  return name
    .toLowerCase()
    .replace(/[|–—\-−,]/g, " ")  // replace separators with space
    .replace(/\s+/g, " ")
    .replace(/pahar theke/g, "")
    .replace(/পাহাড়ি?/g, "")
    .replace(/pahari?/g, "")
    .trim();
}

async function fetchJSON(url) {
  const res = await fetch(url);
  return (await res.json()).data || [];
}

// ─── Main ────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🔗 MongoDB connected");

  const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
  const Product = mongoose.models.Product || mongoose.model("Product", new mongoose.Schema({}, { strict: false }));
  const Customer = mongoose.models.Customer || mongoose.model("Customer", new mongoose.Schema({}, { strict: false }));

  // ── Step 1: Build product map ──
  console.log("\n📦 Mapping products...");
  const apiProducts = await fetchJSON(PRODUCTS_API);
  const dbProducts = await Product.find({}).lean();
  console.log(`   API: ${apiProducts.length}, DB: ${dbProducts.length}`);

  const productMap = {};
  for (const dbp of dbProducts) {
    const dbNorm = normalizeProductName(dbp.name);
    for (const apip of apiProducts) {
      if (productMap[apip.id]) continue;
      const apiNorm = normalizeProductName(apip.name);
      // Check if one contains the other or first 20 chars match
      if (dbNorm.includes(apiNorm) || apiNorm.includes(dbNorm) ||
          dbNorm.slice(0, 20) === apiNorm.slice(0, 20)) {
        productMap[apip.id] = dbp._id.toString();
      }
    }
  }
  console.log(`   Mapped: ${Object.keys(productMap).length}/${apiProducts.length}`);
  const unmapped = apiProducts.filter(p => !productMap[p.id]);
  if (unmapped.length) {
    console.log(`   Unmapped (${unmapped.length}):`);
    for (const p of unmapped.slice(0, 5)) console.log(`     ID ${p.id}: "${p.name}"`);
  }

  // ── Step 2: Load customers into memory ──
  console.log("\n👥 Loading customers...");
  const allCustomers = await Customer.find({ status: true }).lean();
  const customerByPhone = new Map();
  for (const c of allCustomers) {
    if (c.phone) customerByPhone.set(c.phone, c._id.toString());
  }
  console.log(`   Loaded ${allCustomers.length} customers`);

  // Ensure Unknown customer exists
  let unknownId = customerByPhone.get("00000000000");
  if (!unknownId) {
    const unknown = await Customer.create({ name: "Unknown", phone: "00000000000" });
    unknownId = unknown._id.toString();
    customerByPhone.set("00000000000", unknownId);
    console.log("   Created Unknown customer");
  }

  // ── Step 3: Process orders ──
  console.log("\n📋 Fetching orders...");
  const apiOrders = await fetchJSON(ORDERS_API);
  console.log(`   Total: ${apiOrders.length}`);
  apiOrders.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const batches = [];
  let skipped = 0;

  for (const order of apiOrders) {
    // Find customer
    let customerId = null;
    try {
      const shipping = order.shipping_address ? JSON.parse(order.shipping_address) : null;
      if (shipping) {
        const phone = cleanPhone(shipping.phone);
        if (phone && customerByPhone.has(phone)) {
          customerId = customerByPhone.get(phone);
        }
      }
    } catch {}
    if (!customerId) customerId = unknownId;

    // Map items
    const items = [];
    for (const detail of (order.orderDetails || [])) {
      const dbId = productMap[detail.product_id];
      if (!dbId) continue;
      const qty = detail.quantity || 0;
      const price = parseFloat(detail.price) || 0;
      const profit = parseFloat(detail.profit || 0);
      const cost = profit > 0 ? (price - profit) : price;
      items.push({
        product: new mongoose.Types.ObjectId(dbId),
        quantity: qty,
        salePrice: price,
        subtotal: price * qty,
        cost,
        profit: profit > 0 ? profit * qty : 0,
      });
    }

    if (items.length === 0) { skipped++; continue; }

    const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
    const totalCost = items.reduce((s, i) => s + i.cost * i.quantity, 0);
    const totalProfit = items.reduce((s, i) => s + i.profit, 0);
    const grandTotal = parseFloat(order.grand_total) || subtotal;
    const paidAmount = order.payment_status === "paid" ? grandTotal : 0;

    batches.push({
      invoiceNo: order.code || `API-${order.id}`,
      customer: new mongoose.Types.ObjectId(customerId),
      items,
      subtotal,
      shippingCost: parseFloat(order.orderDetails?.[0]?.shipping_cost || 0),
      discount: parseFloat(order.total_discount || 0),
      badgeDiscount: parseFloat(order.badge_discount || 0),
      grandTotal,
      paidAmount,
      dueAmount: grandTotal - paidAmount,
      totalCost,
      totalProfit,
      source: order.pos_order ? "pos" : "website",
      note: order.order_note || "",
    });
  }

  console.log(`   To import: ${batches.length}, Skipped: ${skipped}`);

  // ── Step 4: Bulk insert ──
  if (batches.length === 0) { console.log("✅ Nothing to import"); await mongoose.disconnect(); return; }

  const BATCH_SIZE = 200;
  let imported = 0, errors = 0;
  console.log("\n🔄 Importing orders...");

  for (let i = 0; i < batches.length; i += BATCH_SIZE) {
    const batch = batches.slice(i, i + BATCH_SIZE);
    try {
      await Sale.insertMany(batch, { ordered: false });
      imported += batch.length;
    } catch (err) {
      if (err.writeErrors) {
        imported += batch.length - err.writeErrors.length;
        errors += err.writeErrors.length;
      } else {
        errors += batch.length;
      }
    }
    const pct = Math.min(100, Math.round((i + BATCH_SIZE) / batches.length * 100));
    process.stdout.write(`\r   ✅ ${imported}/${batches.length} (${pct}%) | Errors: ${errors}   `);
  }
  process.stdout.write("\n");

  console.log(`\n🎉 Complete! Imported: ${imported}, Errors: ${errors}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

main().catch(err => { console.error("❌ Fatal:", err); process.exit(1); });
