import mongoose from "mongoose";

const MAX_RETRIES = 5;
let retryCount = 0;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI environment variable is not set");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    retryCount = 0;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    if (retryCount >= MAX_RETRIES) {
      console.error(`Failed to connect after ${MAX_RETRIES} retries. Exiting.`);
      process.exit(1);
    }

    retryCount++;
    console.error(`Retrying in 5 seconds... (attempt ${retryCount}/${MAX_RETRIES})`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return connectDB();
  }
};

export default connectDB;
