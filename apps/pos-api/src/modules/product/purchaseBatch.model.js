import mongoose from "mongoose";

const purchaseBatchSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantId: {
      type: String,
    },

    quantity: {
      type: Number,
      required: true,
    },

    remainingQuantity: {
      type: Number,
      required: true,
    },

    purchasePrice: {
      type: Number,
      required: true,
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PurchaseBatch = mongoose.model(
  "PurchaseBatch",
  purchaseBatchSchema
);

export default PurchaseBatch;
