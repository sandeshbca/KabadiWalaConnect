import { Pickup } from "../models/Pickup.js";
import { MarketPrice } from "../models/MarketPrice.js";
import { Transaction } from "../models/Transaction.js";
import { Inventory } from "../models/Inventory.js";
import { User } from "../models/User.js";

async function matchMarketPrice(material) {
  const prices = await MarketPrice.find().sort({ updatedAt: -1 });
  const needle = String(material || "").toLowerCase();
  return (
    prices.find((item) => item.material.toLowerCase() === needle) ||
    prices.find((item) => {
      const candidate = item.material.toLowerCase();
      return needle.includes(candidate) || candidate.includes(needle);
    })
  );
}

async function rateForPickup(material, address) {
  const rate = await matchMarketPrice(material);
  const addressText = String(address || "").toLowerCase();
  const localityRate = (rate?.localityRates || []).find((item) =>
    addressText.includes(String(item.locality || "").toLowerCase()),
  );
  return { pricePerKg: localityRate?.pricePerKg || rate?.pricePerKg || 0 };
}

function verificationCode() {
  return `SCU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function pickupVerificationCode(pickup) {
  return pickup.verificationCode || `SCU-${String(pickup._id).slice(-6).toUpperCase()}`;
}

function invoiceNumber(pickup) {
  return `SCU-${String(pickup._id).slice(-8).toUpperCase()}`;
}

function canOperatePickup(req, pickup) {
  if (req.user.role === "admin") return true;
  if (!["collector", "dealer"].includes(req.user.role)) return false;
  return String(pickup.assignedCollector) === String(req.user.id);
}

function broadcastPickup(req, pickup) {
  const io = req.app.get("io");
  io.emit("pickup:updated", pickup);
  io.emit("pickup:live", pickup);
  const citizenId = pickup.userId?._id || pickup.userId;
  const collectorId = pickup.assignedCollector?._id || pickup.assignedCollector;
  if (citizenId) io.to(`user:${citizenId}`).emit("pickup:live", pickup);
  if (collectorId) io.to(`user:${collectorId}`).emit("pickup:live", pickup);
  ["collector", "dealer", "citizen", "admin"].forEach((role) =>
    io.to(`role:${role}`).emit("pickup:live", pickup),
  );
}

async function populatedPickup(id) {
  return Pickup.findById(id)
    .populate("userId", "name phone location")
    .populate("assignedCollector", "name phone location ratingAvg ratingCount");
}

export async function listPickups(req, res) {
  const filter =
    req.user.role === "citizen"
      ? { userId: req.user.id }
      : ["collector", "dealer"].includes(req.user.role)
        ? { $or: [{ status: "requested" }, { assignedCollector: req.user.id }] }
        : req.user.role === "recycler"
          ? { status: { $in: ["assigned", "collected", "verified"] } }
          : {};
  const pickups = await Pickup.find(filter)
    .populate("userId", "name phone location")
    .populate("assignedCollector", "name phone location ratingAvg ratingCount")
    .sort({ createdAt: -1 })
    .limit(50);
  pickups.forEach((pickup) => {
    if (!pickup.verificationCode) pickup.verificationCode = pickupVerificationCode(pickup);
  });
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
    serviceType,
    pickupMode,
    recurring,
    couponCode,
  } = req.body;
  if (!material || !address)
    return res.status(400).json({ message: "Material and address are required" });
  const { pricePerKg } = await rateForPickup(material, address);
  const weight = Number(weightKg) || 0;
  const coupon = couponCode
    ? req.user.coupons?.find(
      (item) => item.active !== false && item.code.toUpperCase() === String(couponCode).trim().toUpperCase(),
    )
    : undefined;
  const couponBonus = coupon?.value || 0;
  if (coupon) {
    coupon.active = false;
    await req.user.save();
  }
  const baseAmount = weight > 0 && pricePerKg > 0 ? Math.round(weight * pricePerKg * 100) / 100 : 0;
  const estimatedAmount = baseAmount || couponBonus ? baseAmount + couponBonus : undefined;
  const pickup = await Pickup.create({
    name: req.user.name,
    phone: phone || req.user.phone,
    material,
    address,
    weightKg: weight || undefined,
    description,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    scheduledFor,
    serviceType: serviceType || "scrap_pickup",
    pickupMode: ["household", "business", "industrial"].includes(pickupMode) ? pickupMode : "household",
    recurring: ["once", "weekly", "monthly"].includes(recurring) ? recurring : "once",
    userId: req.user.id,
    lat: req.user.location?.lat,
    lng: req.user.location?.lng,
    paymentMethod: paymentMethod === "upi" ? "upi" : "cash",
    paymentStatus: "pending",
    pricePerKg: pricePerKg || undefined,
    estimatedAmount,
    verificationCode: verificationCode(),
    verificationStatus: "pending",
    couponCode: coupon?.code,
    couponBonus,
    statusHistory: [{ status: "requested", at: new Date(), by: req.user.id }],
  });
  const populated = await populatedPickup(pickup._id);
  broadcastPickup(req, populated);
  res.status(201).json(populated);
}

export async function updatePickupStatus(req, res) {
  const pickup = await Pickup.findById(req.params.id);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  const { status } = req.body;
  if (!["assigned", "collected"].includes(status))
    return res.status(400).json({ message: "Use QR / OTP verification to close this pickup" });
  if (["collector", "dealer"].includes(req.user.role)) {
    if (pickup.status === "requested" && status === "assigned") pickup.assignedCollector = req.user.id;
    else if (String(pickup.assignedCollector) !== String(req.user.id))
      return res.status(403).json({ message: "This pickup belongs to another collection partner" });
  }
  if (req.user.role === "citizen")
    return res.status(403).json({ message: "Citizens cannot change pickup status" });
  pickup.status = status;
  pickup.statusHistory.push({ status, at: new Date(), by: req.user.id });
  await pickup.save();
  const populated = await populatedPickup(pickup._id);
  broadcastPickup(req, populated);
  res.json(populated);
}

export async function recordDigitalWeight(req, res) {
  const pickup = await Pickup.findById(req.params.id);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  if (!canOperatePickup(req, pickup))
    return res.status(403).json({ message: "This pickup is not assigned to you" });
  if (!["assigned", "collected"].includes(pickup.status))
    return res.status(400).json({ message: "Accept the pickup before recording a weight" });
  const weightKg = Number(req.body.weightKg);
  const source = req.body.source === "iot" ? "iot" : "digital";
  if (!Number.isFinite(weightKg) || weightKg <= 0)
    return res.status(400).json({ message: "Enter a valid certified weight" });
  const { pricePerKg } = await rateForPickup(pickup.material, pickup.address);
  pickup.weightKg = weightKg;
  pickup.weighedKg = weightKg;
  pickup.weightSource = source;
  pickup.pricePerKg = pricePerKg || pickup.pricePerKg;
  pickup.estimatedAmount = Math.round((weightKg * (pickup.pricePerKg || 0) + (pickup.couponBonus || 0)) * 100) / 100;
  pickup.statusHistory.push({ status: `weighed_${source}`, at: new Date(), by: req.user.id });
  await pickup.save();
  const populated = await populatedPickup(pickup._id);
  broadcastPickup(req, populated);
  res.json(populated);
}

export async function verifyPickupQr(req, res) {
  const pickup = await Pickup.findById(req.params.id);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  if (!canOperatePickup(req, pickup))
    return res.status(403).json({ message: "This pickup is not assigned to you" });
  if (pickup.status !== "collected")
    return res.status(400).json({ message: "Mark the material collected before verification" });
  if (pickup.verificationStatus === "verified")
    return res.status(409).json({ message: "This pickup has already been verified" });
  if (!req.body.code || String(req.body.code).trim().toUpperCase() !== pickupVerificationCode(pickup).toUpperCase())
    return res.status(400).json({ message: "The QR / OTP code does not match this pickup" });
  pickup.verificationStatus = "verified";
  pickup.verifiedAt = new Date();
  pickup.status = "verified";
  pickup.paymentStatus = "paid";
  pickup.invoiceNumber = pickup.invoiceNumber || invoiceNumber(pickup);
  pickup.statusHistory.push({ status: "verified", at: new Date(), by: req.user.id });
  if (pickup.estimatedAmount && pickup.estimatedAmount > 0) {
    await Transaction.create({
      pickupId: pickup._id,
      payerId: pickup.userId,
      payeeId: pickup.assignedCollector,
      amount: pickup.estimatedAmount,
      method: pickup.paymentMethod || "cash",
      status: "completed",
      roleContext: "pickup",
      note: `Instant ${pickup.paymentMethod === "upi" ? "UPI" : "cash"} settlement · ${pickup.invoiceNumber}`,
    });
  }
  await pickup.save();
  await User.findByIdAndUpdate(pickup.userId, {
    $inc: { rewardPoints: Math.max(10, Math.round((pickup.weighedKg || pickup.weightKg || 0) * 2)) },
  });
  const populated = await populatedPickup(pickup._id);
  broadcastPickup(req, populated);
  res.json(populated);
}

export async function assignPickupToRecycler(req, res) {
  const pickup = await Pickup.findById(req.params.id);
  if (!pickup) return res.status(404).json({ message: "Pickup not found" });
  if (!["collector", "dealer", "admin"].includes(req.user.role))
    return res.status(403).json({ message: "Collection partners only" });
  if (["collector", "dealer"].includes(req.user.role) && String(pickup.assignedCollector) !== String(req.user.id))
    return res.status(403).json({ message: "This pickup is not on your route" });
  if (!["collected", "verified"].includes(pickup.status))
    return res.status(400).json({ message: "Mark the pickup as collected before assigning stock" });
  if (pickup.inventoryListed || await Inventory.findOne({ pickupSourceId: pickup._id }))
    return res.status(409).json({ message: "Already listed for recyclers" });
  const item = await Inventory.create({
    collectorName: req.user.name,
    collectorId: req.user.id,
    material: pickup.material,
    weightKg: pickup.weighedKg || pickup.weightKg || 1,
    pricePerKg: pickup.pricePerKg,
    description: pickup.description || `From citizen pickup ${pickup._id}`,
    imageUrl: pickup.imageUrl,
    location: { area: pickup.address, lat: pickup.lat ?? req.user.location?.lat, lng: pickup.lng ?? req.user.location?.lng },
    pickupSourceId: pickup._id,
    status: "available",
  });
  pickup.inventoryListed = true;
  await pickup.save();
  const populated = await populatedPickup(pickup._id);
  broadcastPickup(req, populated);
  req.app.get("io").emit("inventory:listed", item);
  res.status(201).json({ pickup: populated, inventory: item });
}
