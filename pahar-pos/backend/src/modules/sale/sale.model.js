import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantId: {
      type: String,
    },

    variantName: {
      type: String,
    },

    quantity: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      required: true,
    },

    itemDiscountType: {
      type: String,
      enum: ["None", "Percentage", "Fixed"],
      default: "None",
    },

    itemDiscount: {
      type: Number,
      default: 0,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    cost: {
      type: Number,
      required: true,
    },

    profit: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      unique: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    items: [saleItemSchema],

    subtotal: {
      type: Number,
      required: true,
    },

    shippingCost: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    badgeName: {
      type: String,
    },

    badgeDiscount: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
    },

    totalCost: {
      type: Number,
      required: true,
    },

    totalProfit: {
      type: Number,
      required: true,
    },

    source: {
      type: String,
      enum: ["pos", "website"],
      default: "pos",
    },

    note: {
      type: String,
      default: "",
    },

    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    order_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model(
  "Sale",
  saleSchema
);

export default Sale;
