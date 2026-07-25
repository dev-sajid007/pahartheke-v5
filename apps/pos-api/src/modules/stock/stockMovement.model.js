import mongoose from "mongoose";

const stockMovementSchema =
  new mongoose.Schema(
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      variantId: {
        type: String,
      },

      type: {
        type: String,
        enum: [
          "purchase",
          "sale",
          "adjustment",
          "damage",
          "return",
        ],
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },

      previousStock: {
        type: Number,
        required: true,
      },

      newStock: {
        type: Number,
        required: true,
      },

      note: {
        type: String,
        default: "",
      },

      referenceId: {
        type: mongoose.Schema.Types.ObjectId,
      },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

const StockMovement = mongoose.model(
  "StockMovement",
  stockMovementSchema
);

export default StockMovement;
