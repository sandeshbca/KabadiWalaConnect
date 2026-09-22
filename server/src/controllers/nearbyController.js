import { User } from "../models/User.js";

function distanceKm(a, b) {
  if (!a?.lat || !a?.lng || !b?.lat || !b?.lng) return 9999;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function rankUsers(me, users, kind) {
  return users
    .map((c) => ({
      id: c._id,
      name: c.name,
      phone: c.phone,
      area: c.location?.area || "Area not set",
      lat: c.location?.lat,
      lng: c.location?.lng,
      ratingAvg: c.ratingAvg || 0,
      ratingCount: c.ratingCount || 0,
      kind,
      distanceKm:
        Math.round(distanceKm(me?.location, c.location) * 10) / 10,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 12);
}

export async function nearbyCollectors(req, res) {
  const me = await User.findById(req.user.id).select("location role");
  const collectors = await User.find({
    role: "collector",
    active: { $ne: false },
    verified: true,
  }).select("name phone location ratingAvg ratingCount");
  res.json(rankUsers(me, collectors, "collector"));
}

export async function nearbyRecyclers(req, res) {
  const me = await User.findById(req.user.id).select("location role");
  const recyclers = await User.find({
    role: "recycler",
    active: { $ne: false },
    verified: true,
  }).select("name phone location ratingAvg ratingCount");
  res.json(rankUsers(me, recyclers, "recycler"));
}
