import { Pickup } from "../models/Pickup.js";

export async function listPickups(req, res) {
  const filter =
    req.user.role === "citizen"
      ? { userId: req.user.id }
      : req.user.role === "collector"
        ? { $or: [{ status: "requested" }, { assignedCollector: req.user.id }] }
        : {};
  const pickups = await Pickup.find(filter)
    .populate("userId", "name phone location")
    .populate("assignedCollector", "name phone")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(pickups);
}
export async function createPickup(req, res) {
  const { material, address, phone, weightKg, scheduledFor, description } = req.body;
  if (!material || !address)
    return res
      .status(400)
      .json({ message: "Material and address are required" });
  const pickup = await Pickup.create({
    name: req.user.name,
    phone,
    material,
    address,
    weightKg,
    description,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    scheduledFor,
    userId: req.user.id,
  });
  req.app.get("io").emit("pickup:created", pickup);
  res.status(201).json(pickup);
}
export async function updatePickupStatus(req, res) {
  const pickup = await Pickup.findById(req.params.id);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  const { status } = req.body;
  const allowed = ["assigned", "collected", "verified"];
  if (!allowed.includes(status))
    return res.status(400).json({ message: "Invalid pickup status" });
  if (req.user.role === "collector") {
    if (pickup.status === "requested" && status === "assigned")
      pickup.assignedCollector = req.user.id;
    else if (String(pickup.assignedCollector) !== req.user.id)
      return res
        .status(403)
        .json({ message: "This pickup belongs to another collector" });
  }
  if (req.user.role === "citizen")
    return res
      .status(403)
      .json({ message: "Citizens cannot change pickup status" });
  pickup.status = status;
  await pickup.save();
  req.app.get("io").emit("pickup:updated", pickup);
  res.json(pickup);
}
