import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import { connectDB } from "../utils/db.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "manager", "cashier"], default: "cashier" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export class UserService {
  static async getAll() {
    await connectDB();
    return await User.find({ isActive: true }).select("-password").sort({ name: 1 }).lean();
  }

  static async getById(id) {
    await connectDB();
    const u = await User.findById(id).select("-password").lean();
    if (!u) throw new Error("User not found");
    return u;
  }

  static async create(data) {
    await connectDB();
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error("User with this email already exists");
    const user = await User.create(data);
    const { password, ...rest } = user.toObject();
    return rest;
  }

  static async update(id, data) {
    await connectDB();
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }
    const u = await User.findByIdAndUpdate(id, data, { new: true }).select("-password");
    if (!u) throw new Error("User not found");
    return u;
  }

  static async delete(id) {
    await connectDB();
    const u = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!u) throw new Error("User not found");
    return { deleted: true, message: "User deactivated" };
  }
}
