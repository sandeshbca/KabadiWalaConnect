import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    pickupId: { type: mongoose.Schema.Types.ObjectId, ref: "Pickup" },
    inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
    payerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    payeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ["cash", "upi"], required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    note: String,
    roleContext: {
      type: String,
      enum: ["pickup", "inventory"],
      default: "pickup",
    },
  },
  { timestamps: true },
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
