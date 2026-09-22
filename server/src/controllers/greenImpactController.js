import { Pickup } from "../models/Pickup.js";
import { Inventory } from "../models/Inventory.js";

export async function greenImpact(req, res) {
  const userFilter =
    req.user.role === "citizen" ? { userId: req.user.id } : {};
  const [pickups, weightRows] = await Promise.all([
    Pickup.find(userFilter).select("material weightKg status createdAt"),
    Pickup.aggregate([
      { $match: userFilter },
      { $group: { _id: "$material", kg: { $sum: { $ifNull: ["$weightKg", 0] } } } },
      { $sort: { kg: -1 } },
      { $limit: 8 },
    ]),
  ]);
  const recycledKg = pickups.reduce(
    (sum, p) => sum + (p.status === "verified" ? p.weightKg || 0 : 0),
    0,
  );
  const totalKg = pickups.reduce((sum, p) => sum + (p.weightKg || 0), 0);
  const trees = Math.round(recycledKg / 21);
  const co2Kg = Math.round(recycledKg * 2.4);
  const waterLiters = Math.round(recycledKg * 98);
  res.json({
    recycledKg: Math.round(recycledKg),
    totalKg: Math.round(totalKg),
    co2Kg,
    trees,
    waterLiters,
    pickups: pickups.length,
    materials: weightRows.map((r) => ({
      material: r._id || "Mixed",
      kg: Math.round(r.kg),
    })),
    tip: "Segregate dry waste at home — it increases recycling value and pickup speed.",
  });
}

export async function collectorStats(req, res) {
  if (req.user.role !== "collector" && req.user.role !== "admin")
    return res.status(403).json({ message: "Collectors only" });
  const collectorId =
    req.user.role === "admin" && req.query.collectorId
      ? req.query.collectorId
      : req.user.id;
  const [pickups, inventory] = await Promise.all([
    Pickup.find({ assignedCollector: collectorId }),
    Inventory.find({ collectorId }),
  ]);
  const soldKg = inventory.reduce((s, i) => s + (i.weightKg || 0), 0);
  const soldValue = inventory.reduce(
    (s, i) => s + (i.weightKg || 0) * (i.pricePerKg || 0),
    0,
  );
  const collectedKg = pickups
    .filter((p) => ["collected", "verified"].includes(p.status))
    .reduce((s, p) => s + (p.weightKg || 0), 0);
  const earnings = pickups
    .filter((p) => p.paymentStatus === "paid")
    .reduce((s, p) => s + (p.estimatedAmount || 0), 0);
  const monthly = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const key = day.toISOString().slice(0, 10);
    return pickups
      .filter(
        (p) =>
          p.createdAt && p.createdAt.toISOString().slice(0, 10) === key,
      )
      .reduce((s, p) => s + (p.estimatedAmount || 0), 0);
  });
  res.json({
    collectedKg: Math.round(collectedKg),
    soldKg: Math.round(soldKg),
    soldValue: Math.round(soldValue),
    earnings: Math.round(earnings),
    monthly,
    inventoryCount: inventory.length,
  });
}
