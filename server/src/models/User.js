import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  phone: { type: String, required: true, unique: true, trim: true, match: /^[6-9]\d{9}$/ },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ["citizen", "collector", "recycler", "dealer", "admin"], default: "citizen" },
  verified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: { area: String, lat: Number, lng: Number },
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },
  rewardPoints: { type: Number, default: 100 },
  referralCode: { type: String, unique: true, sparse: true, trim: true },
  referralCount: { type: Number, default: 0 },
  coupons: {
    type: [{
      code: { type: String, required: true },
      title: { type: String, required: true },
      value: { type: Number, required: true },
      active: { type: Boolean, default: true },
    }],
    default: () => [{ code: "WELCOME25", title: "Welcome bonus", value: 25, active: true }],
  },
}, { timestamps: true });
userSchema.pre("save", async function hashPassword(next) { if (!this.isModified("password")) return next(); this.password = await bcrypt.hash(this.password, 12); next(); });
userSchema.methods.comparePassword = function comparePassword(candidate) { return bcrypt.compare(candidate, this.password); };
export const User = mongoose.model("User", userSchema);
