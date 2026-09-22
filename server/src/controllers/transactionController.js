import { Transaction } from "../models/Transaction.js";
import { Pickup } from "../models/Pickup.js";

export async function listTransactions(req, res) {
  const filter =
    req.user.role === "admin"
      ? {}
      : { $or: [{ payerId: req.user.id }, { payeeId: req.user.id }] };
  const items = await Transaction.find(filter)
    .populate("payerId", "name phone role")
    .populate("payeeId", "name phone role")
    .populate("pickupId", "material address status")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(items);
}

export async function completePickupPayment(req, res) {
  const pickup = await Pickup.findById(req.params.pickupId);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  if (String(pickup.userId) !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ message: "Not allowed" });
  const amount =
    Number(req.body.amount) ||
    pickup.estimatedAmount ||
    (pickup.weightKg || 0) * (pickup.pricePerKg || 0);
  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Valid payment amount is required" });
  pickup.paymentStatus = "paid";
  await pickup.save();
  const txn = await Transaction.create({
    pickupId: pickup._id,
    payerId: pickup.userId,
    payeeId: pickup.assignedCollector,
    amount,
    method: pickup.paymentMethod || "cash",
    status: "completed",
    roleContext: "pickup",
    note: req.body.note,
  });
  req.app.get("io").emit("transaction:created", txn);
  res.status(201).json(txn);
}
