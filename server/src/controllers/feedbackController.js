import { Feedback } from "../models/Feedback.js";
import { Pickup } from "../models/Pickup.js";
import { User } from "../models/User.js";

async function refreshCollectorRating(collectorId) {
  const stats = await Feedback.aggregate([
    { $match: { collectorId } },
    {
      $group: {
        _id: "$collectorId",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  const row = stats[0];
  await User.findByIdAndUpdate(collectorId, {
    ratingAvg: row ? Math.round(row.avg * 10) / 10 : 0,
    ratingCount: row?.count || 0,
  });
}

export async function listFeedback(req, res) {
  const filter =
    req.user.role === "admin"
      ? {}
      : req.user.role === "collector"
        ? { collectorId: req.user.id }
        : { citizenId: req.user.id };
  const items = await Feedback.find(filter)
    .populate("citizenId", "name")
    .populate("collectorId", "name phone")
    .populate("pickupId", "material address")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(items);
}

export async function createFeedback(req, res) {
  const { pickupId, rating, comment } = req.body;
  if (!pickupId || !rating)
    return res.status(400).json({ message: "Pickup and rating are required" });
  const pickup = await Pickup.findById(pickupId);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  if (String(pickup.userId) !== req.user.id)
    return res.status(403).json({ message: "Only the citizen can rate this pickup" });
  if (!pickup.assignedCollector)
    return res.status(400).json({ message: "No collector assigned yet" });
  const feedback = await Feedback.create({
    pickupId,
    citizenId: req.user.id,
    collectorId: pickup.assignedCollector,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment,
  });
  await refreshCollectorRating(pickup.assignedCollector);
  res.status(201).json(feedback);
}
