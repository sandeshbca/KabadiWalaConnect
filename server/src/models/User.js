import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  phone: { type: String, required: true, unique: true, trim: true, match: /^[6-9]\d{9}$/ },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ["citizen", "collector", "recycler", "admin"], default: "citizen" },
  verified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: { area: String, lat: Number, lng: Number }
}, { timestamps: true });
userSchema.pre("save", async function hashPassword(next) { if (!this.isModified("password")) return next(); this.password = await bcrypt.hash(this.password, 12); next(); });
userSchema.methods.comparePassword = function comparePassword(candidate) { return bcrypt.compare(candidate, this.password); };
export const User = mongoose.model("User", userSchema);
