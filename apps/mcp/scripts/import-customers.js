import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const CUSTOMER_API = "https://pahartheke.com/mcp-api/v1/customers";

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

async function fetchAllCustomers() {
  console.log("📡 Fetching customers from API...");
  const res = await fetch(CUSTOMER_API);
  const data = await res.json();
  const customers = data.data || [];
  console.log(`✅ API returned ${customers.length} customers`);
  return customers;
}

function transformCustomer(apiCustomer) {
  const user = apiCustomer.user;
  if (!user || !user.phone) return null;

  let name = (user.name || "").trim();
  if (!name) return null;

  // Clean phone - remove non-digit chars
  let phone = user.phone.replace(/\D/g, "");
  if (phone.length < 10) return null;

  return {
    name,
    phone,
    email: user.email || "",
    address: user.address || "",
  };
}

async function importCustomers() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🔗 MongoDB connected");

  const apiCustomers = await fetchAllCustomers();
  const toImport = [];
  const skipped = { noPhone: 0, noName: 0, duplicate: 0 };

  // Get existing phones
  const existingPhones = new Set();
  const allExisting = await Customer.find({}, { phone: 1 }).lean();
  allExisting.forEach(c => existingPhones.add(c.phone));
  console.log(`📦 Existing in DB: ${existingPhones.size} customers`);

  for (const apiC of apiCustomers) {
    const transformed = transformCustomer(apiC);
    if (!transformed) {
      const user = apiC.user;
      if (!user || !user.phone) skipped.noPhone++;
      else if (!(user.name || "").trim()) skipped.noName++;
      continue;
    }
    if (existingPhones.has(transformed.phone)) {
      skipped.duplicate++;
      continue;
    }
    toImport.push(transformed);
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   Total from API: ${apiCustomers.length}`);
  console.log(`   Skipped (no phone): ${skipped.noPhone}`);
  console.log(`   Skipped (no name): ${skipped.noName}`);
  console.log(`   Skipped (already in DB): ${skipped.duplicate}`);
  console.log(`   To import: ${toImport.length}`);

  if (toImport.length === 0) {
    console.log("✅ Nothing to import!");
    await mongoose.disconnect();
    return;
  }

  // Import in batches of 100
  const BATCH_SIZE = 100;
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < toImport.length; i += BATCH_SIZE) {
    const batch = toImport.slice(i, i + BATCH_SIZE);
    try {
      await Customer.insertMany(batch, { ordered: false });
      imported += batch.length;
      console.log(`   ✅ Imported ${imported}/${toImport.length} (batch ${Math.floor(i/BATCH_SIZE) + 1})`);
    } catch (err) {
      // Count how many were actually inserted
      if (err.writeErrors) {
        imported += batch.length - err.writeErrors.length;
        errors += err.writeErrors.length;
      }
      console.log(`   ⚠️ Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${err.writeErrors?.length || 0} errors`);
    }
  }

  console.log(`\n🎉 Import complete!`);
  console.log(`   Successfully imported: ${imported}`);
  console.log(`   Errors: ${errors}`);

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB");
}

importCustomers().catch(err => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
