import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Connect to MongoDB
 */
export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    logger.info("MongoDB Connected for MCP Server");
  } catch (error) {
    logger.error("MongoDB Connection Error:", (error as Error).message);
    throw error;
  }
};
