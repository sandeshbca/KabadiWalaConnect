import { MarketPrice } from "../models/MarketPrice.js";

const initialPrices = [
  { material: "PET plastic", pricePerKg: 25, trend: "up" },
  { material: "Mixed paper", pricePerKg: 12, trend: "stable" },
  { material: "Cardboard", pricePerKg: 14, trend: "up" },
  { material: "Aluminium", pricePerKg: 145, trend: "down" },
  { material: "Iron", pricePerKg: 35, trend: "stable" },
  { material: "E-waste", pricePerKg: 70, trend: "up" },
];

const publicPrice = (item) => ({
  id: String(item._id || item.id),
  material: item.material,
  pricePerKg: item.pricePerKg,
  trend: item.trend,
  updatedAt: item.updatedAt,
});

export async function ensureDefaultMarketPrices() {
  if (await MarketPrice.exists({})) return;
  await MarketPrice.insertMany(initialPrices);
}

export async function listMarketPrices(_req, res) {
  const prices = await MarketPrice.find().sort({ material: 1 });
  res.json(prices.map(publicPrice));
}

export async function createMarketPrice(req, res) {
  const { material, pricePerKg, trend = "stable" } = req.body;
  if (!material || !Number.isFinite(Number(pricePerKg)) || Number(pricePerKg) < 0)
    return res.status(400).json({ message: "Material and a valid price are required" });
  if (!["up", "down", "stable"].includes(trend))
    return res.status(400).json({ message: "Invalid market trend" });
  const price = await MarketPrice.create({
    material: String(material).trim(),
    pricePerKg: Number(pricePerKg),
    trend,
    updatedBy: req.user.id,
  });
  req.app.get("io").emit("market:updated", publicPrice(price));
  res.status(201).json(publicPrice(price));
}

export async function updateMarketPrice(req, res) {
  const price = await MarketPrice.findById(req.params.id);
  if (!price) return res.status(404).json({ message: "Market price entry not found" });
  const { pricePerKg, trend } = req.body;
  if (pricePerKg !== undefined) {
    if (!Number.isFinite(Number(pricePerKg)) || Number(pricePerKg) < 0)
      return res.status(400).json({ message: "Please enter a valid price" });
    price.pricePerKg = Number(pricePerKg);
  }
  if (trend !== undefined) {
    if (!["up", "down", "stable"].includes(trend))
      return res.status(400).json({ message: "Invalid market trend" });
    price.trend = trend;
  }
  price.updatedBy = req.user.id;
  await price.save();
  req.app.get("io").emit("market:updated", publicPrice(price));
  res.json(publicPrice(price));
}
