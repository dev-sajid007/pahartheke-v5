import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Retrying in 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return connectDB();
  }
};

export default connectDB;