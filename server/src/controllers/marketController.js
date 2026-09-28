import { MarketPrice } from "../models/MarketPrice.js";

const initialPrices = [
  ["Newspaper", 14, "up"], ["Mixed paper", 12, "stable"], ["Cardboard", 14, "up"], ["Books", 11, "stable"], ["Office paper", 15, "up"],
  ["PET plastic", 25, "up"], ["HDPE plastic", 32, "stable"], ["LDPE plastic", 18, "down"], ["Plastic bottles", 22, "up"], ["Mixed plastic", 16, "stable"],
  ["Iron", 35, "stable"], ["MS scrap", 34, "up"], ["TMT steel", 38, "stable"], ["GI scrap", 42, "down"], ["Cast iron", 32, "stable"], ["Iron pipes", 30, "up"],
  ["Aluminium", 145, "down"], ["Aluminium cans", 120, "up"], ["Copper", 650, "up"], ["Brass", 430, "stable"], ["Stainless steel", 92, "up"], ["Zinc", 180, "down"],
  ["E-waste", 70, "up"], ["Mobile phones", 120, "up"], ["Laptops", 180, "stable"], ["Computer parts", 85, "up"], ["Cables", 55, "stable"], ["Batteries", 62, "down"], ["TV / monitors", 28, "stable"],
  ["Glass bottles", 3, "stable"], ["Glass sheets", 4, "down"], ["Tyres", 18, "up"], ["Rubber", 16, "stable"], ["Cotton clothes", 12, "stable"], ["Used footwear", 8, "down"],
  ["Wood", 10, "stable"], ["Furniture", 9, "down"], ["Vehicle scrap", 36, "up"], ["AC / fridge", 45, "stable"], ["Appliances", 35, "up"], ["Used oil", 24, "stable"],
].map(([material, pricePerKg, trend]) => ({
  material,
  pricePerKg,
  trend,
  localityRates: [
    { locality: "Delhi", pricePerKg: Math.round(Number(pricePerKg) * 100) / 100, trend },
    { locality: "Varanasi", pricePerKg: Math.round(Number(pricePerKg) * 0.96 * 100) / 100, trend },
    { locality: "Bengaluru", pricePerKg: Math.round(Number(pricePerKg) * 1.05 * 100) / 100, trend },
  ],
}));

const publicPrice = (item) => ({
  id: String(item._id || item.id),
  material: item.material,
  pricePerKg: item.pricePerKg,
  trend: item.trend,
  updatedAt: item.updatedAt,
  localityRates: (item.localityRates || []).map((rate) => ({
    locality: rate.locality,
    pricePerKg: rate.pricePerKg,
    trend: rate.trend,
    updatedAt: rate.updatedAt,
  })),
});

export async function ensureDefaultMarketPrices() {
  await Promise.all(
    initialPrices.map((item) =>
      MarketPrice.updateOne(
        { material: item.material },
        { $setOnInsert: item },
        { upsert: true },
      ),
    ),
  );
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

export async function updateLocalityMarketPrice(req, res) {
  const price = await MarketPrice.findById(req.params.id);
  if (!price) return res.status(404).json({ message: "Market price entry not found" });
  const { locality, pricePerKg, trend = "stable" } = req.body;
  if (!locality || !Number.isFinite(Number(pricePerKg)) || Number(pricePerKg) < 0)
    return res.status(400).json({ message: "Locality and a valid price are required" });
  if (!["up", "down", "stable"].includes(trend))
    return res.status(400).json({ message: "Invalid market trend" });
  const index = (price.localityRates || []).findIndex(
    (rate) => rate.locality.toLowerCase() === String(locality).trim().toLowerCase(),
  );
  const next = { locality: String(locality).trim(), pricePerKg: Number(pricePerKg), trend, updatedAt: new Date() };
  if (index >= 0) price.localityRates[index] = next;
  else price.localityRates.push(next);
  price.updatedBy = req.user.id;
  await price.save();
  req.app.get("io").emit("market:updated", publicPrice(price));
  res.json(publicPrice(price));
}
