import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

interface ISettings {
  storeName?: string;
  contactPhone?: string;
  storeAddress?: string;
  invoicePrefix?: string;
  taxRate?: number;
  invoiceFooterMessage?: string;
  logo?: string;
}

const settingsSchema = new mongoose.Schema<ISettings>(
  {
    storeName: { type: String, default: "PAHAR POS" },
    contactPhone: { type: String, default: "+880 1700-000000" },
    storeAddress: { type: String, default: "123 Business Avenue, Tech District, City" },
    invoicePrefix: { type: String, default: "INV-" },
    taxRate: { type: Number, default: 0 },
    invoiceFooterMessage: { type: String, default: "Thank You For Your Purchase. Goods once sold cannot be returned." },
    logo: { type: String },
  },
  { timestamps: true }
);

const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", settingsSchema);

export class SettingsService {
  static async get(): Promise<any> {
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = await Settings.create({});
    }
    return settings;
  }

  static async update(data: any): Promise<any> {
    await connectDB();
    return await Settings.findOneAndUpdate({}, data, { upsert: true, new: true }).lean();
  }
}
