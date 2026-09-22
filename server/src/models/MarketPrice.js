import mongoose from "mongoose";

const marketPriceSchema = new mongoose.Schema(
  {
    material: { type: String, required: true, trim: true, unique: true, maxlength: 80 },
    pricePerKg: { type: Number, required: true, min: 0 },
    trend: { type: String, enum: ["up", "down", "stable"], default: "stable" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const MarketPrice = mongoose.model("MarketPrice", marketPriceSchema);
