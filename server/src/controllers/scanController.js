const FALLBACK = [
  { material: "Plastic bottle", priceHint: "PET bottles fetch good rates when clean" },
  { material: "Cardboard / paper", priceHint: "Keep paper dry — moisture lowers price" },
  { material: "Metal can", priceHint: "Aluminium cans are high value per kg" },
  { material: "Mixed dry waste", priceHint: "Sort into plastic, metal and paper for better payout" },
];

function demoResult(file) {
  const pick = FALLBACK[file.size % FALLBACK.length];
  return {
    material: pick.material,
    confidence: 78 + (file.size % 15),
    guidance: pick.priceHint,
    suggestions: [
      "Rinse and dry items before pickup.",
      "Check live market rates before booking.",
      "Segregate mixed waste to increase estimated value.",
    ],
    source: "demo",
  };
}

export async function analyzeScan(req, res) {
  if (!req.file)
    return res.status(400).json({ message: "An image is required" });
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.json(demoResult(req.file));

  try {
    const base64 = req.file.buffer.toString("base64");
    const mime = req.file.mimetype || "image/jpeg";
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.CLIENT_ORIGIN || "http://localhost:3000",
        "X-Title": "KabadiConnect Waste Scan",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a waste recycling assistant for India. Identify the main recyclable material in this photo. Reply ONLY with valid JSON: {"material":"short label","confidence":0-100,"guidance":"one sentence","suggestions":["tip1","tip2","tip3"]}. Use common kabadi/scrap categories (plastic, paper, metal, e-waste, glass, mixed).`,
              },
              {
                type: "image_url",
                image_url: { url: `data:${mime};base64,${base64}` },
              },
            ],
          },
        ],
        max_tokens: 400,
      }),
    });
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in model response");
    const parsed = JSON.parse(jsonMatch[0]);
    return res.json({
      material: parsed.material || "Mixed dry waste",
      confidence: Number(parsed.confidence) || 85,
      guidance: parsed.guidance || "Keep material clean and dry before collection.",
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions.slice(0, 4)
        : demoResult(req.file).suggestions,
      source: "openrouter",
    });
  } catch {
    return res.json(demoResult(req.file));
  }
}
