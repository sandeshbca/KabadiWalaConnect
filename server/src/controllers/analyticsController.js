import { Inventory } from "../models/Inventory.js";
import { Pickup } from "../models/Pickup.js";
import { User } from "../models/User.js";
export async function overview(_req, res) {
  const [pickups, collectors, inventory, materialBreakdown] = await Promise.all([
    Pickup.countDocuments(),
    User.countDocuments({ role: "collector" }),
    Inventory.aggregate([
      { $match: { status: { $in: ["available", "reserved", "collected"] } } },
      { $group: { _id: null, total: { $sum: "$weightKg" } } },
    ]),
    Inventory.aggregate([
      { $match: { status: { $in: ["available", "reserved", "collected"] } } },
      { $group: { _id: "$material", weightKg: { $sum: "$weightKg" } } },
      { $sort: { weightKg: -1 } },
      { $limit: 5 },
    ]),
  ]);
  const recycledKg = inventory[0]?.total || 0;
  const monthly = [];
  for (let i = 6; i >= 0; i--) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - i);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const kg = await Pickup.aggregate([
      {
        $match: {
          status: "verified",
          updatedAt: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: null, total: { $sum: { $ifNull: ["$weightKg", 0] } } } },
    ]);
    monthly.push(Math.round(kg[0]?.total || 0));
  }
  res.json({
    pickups,
    recycledKg,
    co2Kg: Math.round(recycledKg * 2.4),
    collectors,
    monthly,
    materialBreakdown: materialBreakdown.map((item) => ({
      material: item._id || "Other material",
      weightKg: Math.round(item.weightKg),
    })),
  });
}
