import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
    },

    barcode: {
      type: String,
      unique: true,
      sparse: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    productType: {
      type: String,
      enum: [
        "weight",
        "piece",
        "packet",
        "bundle",
      ],
      default: "piece",
    },

    unit: {
      type: String,
      default: "pcs",
    },

    purchasePrice: {
      type: Number,
      required: true,
      default: 0,
    },

    salePrice: {
      type: Number,
      required: true,
      default: 0,
    },

    currentStock: {
      type: Number,
      default: 0,
    },

    minimumStockAlert: {
      type: Number,
      default: 5,
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    image: {
      type: String,
      default: "",
    },

    status: {
      type: Boolean,
      default: true,
    },
    
    hasVariants: {
      type: Boolean,
      default: false,
    },
    
    variants: [
      {
        variantId: String,
        name: String,
        sku: String,
        barcode: String,
        purchasePrice: Number,
        salePrice: Number,
        currentStock: {
          type: Number,
          default: 0,
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;
