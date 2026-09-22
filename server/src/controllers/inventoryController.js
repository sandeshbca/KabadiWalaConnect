import { Inventory } from "../models/Inventory.js";

export async function listInventory(req, res) {
  const filter =
    req.user.role === "collector"
      ? { collectorId: req.user.id }
      : { status: "available" };
  const items = await Inventory.find(filter)
    .populate("collectorId", "name phone location")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(items);
}
export async function createInventory(req, res) {
  const { material, weightKg, pricePerKg, location, description } = req.body;
  if (!material || !weightKg)
    return res
      .status(400)
      .json({ message: "Material and weight are required" });
  let parsedLocation = location;
  if (typeof location === "string") {
    try {
      parsedLocation = JSON.parse(location);
    } catch {
      parsedLocation = { area: location };
    }
  }
  const item = await Inventory.create({
    collectorName: req.user.name,
    collectorId: req.user.id,
    material,
    weightKg,
    pricePerKg,
    description,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    location: parsedLocation,
  });
  req.app.get("io").emit("inventory:listed", item);
  res.status(201).json(item);
}
export async function reserveInventory(req, res) {
  const item = await Inventory.findOneAndUpdate(
    { _id: req.params.id, status: "available" },
    { status: "reserved", reservedBy: req.user.id },
    { new: true },
  );
  if (!item)
    return res
      .status(409)
      .json({ message: "This stock is no longer available" });
  req.app.get("io").emit("inventory:updated", item);
  res.json(item);
}
export async function updateInventoryStatus(req, res) {
  const item = await Inventory.findOne({
    _id: req.params.id,
    collectorId: req.user.id,
  });
  if (!item) return res.status(404).json({ message: "Stock item not found" });
  if (!["available", "collected"].includes(req.body.status))
    return res.status(400).json({ message: "Invalid stock status" });
  item.status = req.body.status;
  await item.save();
  req.app.get("io").emit("inventory:updated", item);
  res.json(item);
}
