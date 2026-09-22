import mongoose from "mongoose";
const inventorySchema = new mongoose.Schema(
  {
    collectorName: String,
    collectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    material: { type: String, required: true },
    weightKg: { type: Number, required: true },
    pricePerKg: Number,
    description: { type: String, trim: true, maxlength: 500 },
    imageUrl: String,
    location: { area: String, lat: Number, lng: Number },
    status: {
      type: String,
      enum: ["available", "reserved", "collected"],
      default: "available",
    },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pickupSourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Pickup" },
  },
  { timestamps: true },
);
export const Inventory = mongoose.model("Inventory", inventorySchema);
