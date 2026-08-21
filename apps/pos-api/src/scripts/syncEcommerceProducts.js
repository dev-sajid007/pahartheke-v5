import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import Category from "../modules/category/category.model.js";
import Product from "../modules/product/product.model.js";

const PRODUCTS_API =
  process.env.EXTERNAL_ECOMMERCE_PRODUCTS_API ||
  "https://www.pahartheke.com/mcp-api/v1/products";

const cleanName = (name) => {
  const idx = (name || "").lastIndexOf("|");
  if (idx !== -1) {
    const tail = name.slice(idx + 1).toLowerCase();
    if (tail.includes("pahar theke") || tail.includes("pahaht theke")) {
      name = name.slice(0, idx);
    }
  }
  return name
    .replace(/\s+[-–—]+\s*Paha[a-z]* Theke\s*\.?$/i, "")
    .replace(/\s+$/g, "")
    .trim();
};

const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const resolveTypeAndUnit = (unit) => {
  const u = (unit || "").toLowerCase();
  if (u.includes("kg") || u.includes("gram") || u.includes("gm")) {
    return { productType: "weight", unit: "kg" };
  }
  if (u.includes("pc") || u.includes("piece")) {
    return { productType: "piece", unit: "pcs" };
  }
  return { productType: "piece", unit: u || "pcs" };
};

const syncProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const res = await fetch(PRODUCTS_API, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Products API responded with status ${res.status}`);
    }

    const json = await res.json();
    const externalProducts = Array.isArray(json?.data) ? json.data : [];
    console.log(`Fetched ${externalProducts.length} products from API`);

    const categories = await Category.find().select("_id slug name");
    const categoryBySlug = new Map();
    for (const cat of categories) {
      categoryBySlug.set(cat.slug, cat._id);
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const p of externalProducts) {
      const externalCategory = p.category;
      const externalSlug = externalCategory?.slug;
      const categoryId = externalSlug
        ? categoryBySlug.get(externalSlug)
        : undefined;

      if (!categoryId) {
        console.warn(
          `SKIP ${p.id}: no matching POS category for slug "${externalSlug}"`
        );
        skipped++;
        continue;
      }

      const { productType, unit } = resolveTypeAndUnit(p.unit);
      const name = cleanName(p.name);

      const data = {
        name,
        sku: `EXT-${p.id}`,
        barcode: p.barcode || undefined,
        category: categoryId,
        productType,
        unit,
        purchasePrice: p.purchase_price || 0,
        salePrice: p.unit_price || 0,
        currentStock: p.current_stock ?? 0,
        minimumStockAlert: p.low_stock_quantity || 5,
        slug: p.slug,
        description: stripHtml(p.short_description || p.description),
        tags: p.tags
          ? p.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        status: p.published === 1,
        hasVariants: false,
        variants: [],
      };

      let doc;
      try {
        doc = await Product.findOne({ sku: `EXT-${p.id}` });
      } catch (error) {
        console.error(`ERROR ${p.id}: ${error.message}`);
        skipped++;
        continue;
      }

      const upsert = async (payload) => {
        if (doc) {
          await Product.updateOne({ _id: doc._id }, { $set: payload });
          return "updated";
        }
        await Product.create(payload);
        return "created";
      };

      try {
        const action = await upsert(data);
        if (action === "created") created++;
        else updated++;
      } catch (error) {
        if (error?.code === 11000 && data.barcode) {
          delete data.barcode;
          try {
            const action = await upsert(data);
            if (action === "created") created++;
            else updated++;
            console.warn(
              `WARN ${p.id}: duplicate barcode dropped for "${data.name}"`
            );
          } catch (retryError) {
            console.error(`ERROR ${p.id}: ${retryError.message}`);
            skipped++;
          }
        } else {
          console.error(`ERROR ${p.id}: ${error.message}`);
          skipped++;
        }
      }
    }

    console.log(
      `Done. created=${created} updated=${updated} skipped=${skipped}`
    );
  } catch (error) {
    console.error("Sync failed:", error);
  } finally {
    await mongoose.connection.close();
  }
};

syncProducts();
