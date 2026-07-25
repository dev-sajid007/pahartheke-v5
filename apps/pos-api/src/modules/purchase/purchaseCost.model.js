import mongoose from "mongoose";

const purchaseCostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PurchaseCost = mongoose.model("PurchaseCost", purchaseCostSchema);

export default PurchaseCost;
