import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    companyName: {
      type: String,
      default: "",
    },

    previousDue: {
      type: Number,
      default: 0,
    },

    totalPurchaseAmount: {
      type: Number,
      default: 0,
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

const Supplier = mongoose.model(
  "Supplier",
  supplierSchema
);

export default Supplier;
