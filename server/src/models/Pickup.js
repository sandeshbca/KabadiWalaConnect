import mongoose from "mongoose";
const pickupSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    address: { type: String, required: true },
    material: { type: String, required: true },
    weightKg: Number,
    description: { type: String, trim: true, maxlength: 500 },
    imageUrl: String,
    status: {
      type: String,
      enum: ["requested", "assigned", "collected", "verified"],
      default: "requested",
    },
    scheduledFor: Date,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedCollector: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentMethod: { type: String, enum: ["cash", "upi"], default: "cash" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    estimatedAmount: Number,
    pricePerKg: Number,
    inventoryListed: { type: Boolean, default: false },
    lat: Number,
    lng: Number,
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true },
);
export const Pickup = mongoose.model("Pickup", pickupSchema);
