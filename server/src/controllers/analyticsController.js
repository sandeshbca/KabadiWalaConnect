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
  res.json({
    pickups,
    recycledKg,
    co2Kg: Math.round(recycledKg * 2.4),
    collectors,
    monthly: [52, 68, 61, 89, 74, 96, 118],
    materialBreakdown: materialBreakdown.map((item) => ({
      material: item._id || "Other material",
      weightKg: Math.round(item.weightKg),
    })),
  });
}
