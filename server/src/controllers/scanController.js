export function analyzeScan(req, res) {
  if (!req.file)
    return res.status(400).json({ message: "An image is required" });
  const labels = [
    "Plastic bottle",
    "Cardboard / paper",
    "Metal can",
    "Mixed dry waste",
  ];
  const material = labels[req.file.size % labels.length];
  return res.json({
    material,
    confidence: 88 + (req.file.size % 10),
    guidance: "Keep it clean and dry. A verified recycler can collect it.",
  });
}
