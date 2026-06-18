import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const categoryMap = {
  1: "6a241d788477e08d0c932dfa", // Seasonal fruits
  2: "6a241d768477e08d0c932df5", // Hilly Chicken
  3: "6a241d778477e08d0c932df6", // Kaptai fishes
  4: "6a241d788477e08d0c932df9", // Mountain Spices
  5: "6a241d778477e08d0c932df7", // Kitchen & Catering
  11: "6a241d798477e08d0c932dfb", // sticky rice
  12: "6a241d788477e08d0c932df8", // Mountain Mango
  13: "6a241d798477e08d0c932dfc", // কাপ্তাই ছোটো মাছ
  14: "6a241d7a8477e08d0c932dfe", // কাপ্তাই লেকের দেশি বড় মাছ
  15: "6a241d7a8477e08d0c932dfd", // কাপ্তাই মাছের ১ কেজি প্যাক
  17: "6a241d7b8477e08d0c932e01", // পাহাড়ি সবজি ও অন্যানো
  19: "6a241d7a8477e08d0c932dff", // Monster Fish
  20: "6a241d7b8477e08d0c932e00", // পাহাড়ি বুনো আচার
};

function mapUnit(unit) {
  if (!unit) return { productType: "piece", unit: "pcs" };
  const u = unit.toLowerCase().trim();
  if (u.includes("kg") || u === "kg" || u.includes("gram") || u.includes("gm")) {
    return { productType: "weight", unit: "kg" };
  }
  if (u.includes("pkt") || u.includes("pack")) {
    return { productType: "packet", unit: "pkt" };
  }
  return { productType: "piece", unit: "pcs" };
}

function toNum(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    productType: { type: String, enum: ["weight", "piece", "packet", "bundle"], default: "piece" },
    unit: { type: String, default: "pcs" },
    purchasePrice: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },
    currentStock: { type: Number, default: 0 },
    minimumStockAlert: { type: Number, default: 5 },
    status: { type: Boolean, default: true },
    hasVariants: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

async function fetchProducts() {
  const res = await fetch("https://pahartheke.com/mcp-api/v1/products");
  const json = await res.json();
  return json.data || [];
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const apiProducts = await fetchProducts();
  console.log(`Fetched ${apiProducts.length} products from API`);

  let created = 0;
  let skipped = 0;

  for (const p of apiProducts) {
    const catId = categoryMap[p.category_id];
    if (!catId) {
      console.log(`  SKIP (no category mapping): ${p.name} (category_id: ${p.category_id})`);
      skipped++;
      continue;
    }

    const { productType, unit } = mapUnit(p.unit);
    const purchasePrice = toNum(p.purchase_price) || 0;
    const salePrice = toNum(p.price) || purchasePrice || 0;
    const stock = toNum(p.current_stock ?? p.stock ?? 0);
    const sku = p.sku || ("SKU-" + Math.random().toString(36).substring(2, 8).toUpperCase());

    try {
      await Product.create({
        name: p.name,
        sku,
        category: catId,
        productType,
        unit,
        purchasePrice,
        salePrice,
        currentStock: stock,
        minimumStockAlert: 5,
        status: true,
      });
      created++;
    } catch (err) {
      if (err.code === 11000) {
        console.log(`  SKIP (duplicate): ${p.name}`);
        skipped++;
      } else {
        console.error(`  ERROR: ${p.name}: ${err.message}`);
        skipped++;
      }
    }
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}, Total: ${apiProducts.length}`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
