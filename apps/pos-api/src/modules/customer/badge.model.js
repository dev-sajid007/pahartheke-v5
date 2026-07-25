import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String, // lucide icon name or image url
      default: "Award",
    },
    discount: {
      type: Number,
      default: 0,
    },
    conditions: [
      {
        field: { type: String, enum: ["totalOrders", "totalSpent"] },
        operator: { type: String, enum: ["gt", "lt", "gte", "lte", "eq"] },
        value: { type: Number },
      }
    ],
    color: {
      type: String,
      default: "#3b82f6", // default blue
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

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;
