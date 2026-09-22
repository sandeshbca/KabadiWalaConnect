import { Pickup } from "../models/Pickup.js";
import { MarketPrice } from "../models/MarketPrice.js";
import { Transaction } from "../models/Transaction.js";
import { Inventory } from "../models/Inventory.js";

async function matchMarketPrice(material) {
  const prices = await MarketPrice.find().sort({ updatedAt: -1 });
  const needle = String(material || "").toLowerCase();
  const exact = prices.find((p) => p.material.toLowerCase() === needle);
  if (exact) return exact;
  return prices.find((p) => {
    const m = p.material.toLowerCase();
    return needle.includes(m) || m.includes(needle);
  });
}

function broadcastPickup(req, pickup) {
  const io = req.app.get("io");
  io.emit("pickup:updated", pickup);
  io.emit("pickup:live", pickup);
  const citizenId = pickup.userId?._id || pickup.userId;
  if (citizenId) io.to(`user:${citizenId}`).emit("pickup:live", pickup);
  const collectorId =
    pickup.assignedCollector?._id || pickup.assignedCollector;
  if (collectorId) io.to(`user:${collectorId}`).emit("pickup:live", pickup);
  io.to("role:collector").emit("pickup:live", pickup);
  io.to("role:citizen").emit("pickup:live", pickup);
  io.to("role:admin").emit("pickup:live", pickup);
}

export async function listPickups(req, res) {
  const filter =
    req.user.role === "citizen"
      ? { userId: req.user.id }
      : req.user.role === "collector"
        ? { $or: [{ status: "requested" }, { assignedCollector: req.user.id }] }
        : req.user.role === "recycler"
          ? { status: { $in: ["assigned", "collected", "verified"] } }
          : {};
  const pickups = await Pickup.find(filter)
    .populate("userId", "name phone location")
    .populate("assignedCollector", "name phone location ratingAvg ratingCount")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(pickups);
}

export async function createPickup(req, res) {
  const {
    material,
    address,
    phone,
    weightKg,
    scheduledFor,
    description,
    paymentMethod,
  } = req.body;
  if (!material || !address)
    return res
      .status(400)
      .json({ message: "Material and address are required" });
  const rate = await matchMarketPrice(material);
  const weight = Number(weightKg) || 0;
  const pricePerKg = rate?.pricePerKg || 0;
  const estimatedAmount =
    weight > 0 && pricePerKg > 0
      ? Math.round(weight * pricePerKg * 100) / 100
      : undefined;
  const pickup = await Pickup.create({
    name: req.user.name,
    phone: phone || req.user.phone,
    material,
    address,
    weightKg: weight || undefined,
    description,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    scheduledFor,
    userId: req.user.id,
    lat: req.user.location?.lat,
    lng: req.user.location?.lng,
    paymentMethod: paymentMethod === "upi" ? "upi" : "cash",
    paymentStatus: "pending",
    pricePerKg: pricePerKg || undefined,
    estimatedAmount,
    statusHistory: [{ status: "requested", at: new Date(), by: req.user.id }],
  });
  const populated = await Pickup.findById(pickup._id)
    .populate("userId", "name phone location")
    .populate("assignedCollector", "name phone location");
  broadcastPickup(req, populated);
  res.status(201).json(populated);
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
    else if (String(pickup.assignedCollector) !== String(req.user.id))
      return res
        .status(403)
        .json({ message: "This pickup belongs to another collector" });
  }
  if (req.user.role === "citizen")
    return res
      .status(403)
      .json({ message: "Citizens cannot change pickup status" });
  pickup.status = status;
  pickup.statusHistory = pickup.statusHistory || [];
  pickup.statusHistory.push({
    status,
    at: new Date(),
    by: req.user.id,
  });
  if (status === "verified" && pickup.paymentStatus === "pending") {
    pickup.paymentStatus = "paid";
    if (pickup.estimatedAmount && pickup.estimatedAmount > 0) {
      await Transaction.create({
        pickupId: pickup._id,
        payerId: pickup.userId,
        payeeId: pickup.assignedCollector,
        amount: pickup.estimatedAmount,
        method: pickup.paymentMethod || "cash",
        status: "completed",
        roleContext: "pickup",
      });
    }
  }
  await pickup.save();
  const populated = await Pickup.findById(pickup._id)
    .populate("userId", "name phone location")
    .populate("assignedCollector", "name phone location ratingAvg ratingCount");
  broadcastPickup(req, populated);
  res.json(populated);
}

export async function assignPickupToRecycler(req, res) {
  const pickup = await Pickup.findById(req.params.id);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  if (req.user.role !== "collector" && req.user.role !== "admin")
    return res.status(403).json({ message: "Collectors only" });
  if (
    req.user.role === "collector" &&
    String(pickup.assignedCollector) !== String(req.user.id)
  )
    return res.status(403).json({ message: "This pickup is not on your route" });
  if (!["collected", "verified"].includes(pickup.status))
    return res
      .status(400)
      .json({ message: "Mark the pickup as collected before assigning stock" });
  if (pickup.inventoryListed)
    return res.status(409).json({ message: "Already listed for recyclers" });
  const duplicate = await Inventory.findOne({ pickupSourceId: pickup._id });
  if (duplicate)
    return res.status(409).json({ message: "Already listed for recyclers" });

  const item = await Inventory.create({
    collectorName: req.user.name,
    collectorId: req.user.id,
    material: pickup.material,
    weightKg: pickup.weightKg || 1,
    pricePerKg: pickup.pricePerKg,
    description: pickup.description || `From citizen pickup ${pickup._id}`,
    imageUrl: pickup.imageUrl,
    location: {
      area: pickup.address,
      lat: pickup.lat ?? req.user.location?.lat,
      lng: pickup.lng ?? req.user.location?.lng,
    },
    pickupSourceId: pickup._id,
    status: "available",
  });
  pickup.inventoryListed = true;
  await pickup.save();
  const populated = await Pickup.findById(pickup._id)
    .populate("userId", "name phone location")
    .populate("assignedCollector", "name phone location ratingAvg ratingCount");
  broadcastPickup(req, populated);
  req.app.get("io").emit("inventory:listed", item);
  res.status(201).json({ pickup: populated, inventory: item });
}
