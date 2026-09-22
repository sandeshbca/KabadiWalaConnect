import { User } from "../models/User.js";

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  phone: user.phone,
  role: user.role,
  verified: user.verified,
  active: user.active,
  location: user.location,
  createdAt: user.createdAt,
});

export async function listTeam(req, res) {
  const role = req.query.role;
  const filter = role && ["collector", "recycler"].includes(role)
    ? { role }
    : { role: { $in: ["collector", "recycler"] } };
  const team = await User.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json(team.map(safeUser));
}

export async function updateTeamMember(req, res) {
  if (req.params.id === req.user.id)
    return res.status(400).json({ message: "You cannot change your own access from this screen" });
  const member = await User.findOne({
    _id: req.params.id,
    role: { $in: ["collector", "recycler"] },
  });
  if (!member) return res.status(404).json({ message: "Team member not found" });
  const { verified, active } = req.body;
  if (typeof verified === "boolean") member.verified = verified;
  if (typeof active === "boolean") member.active = active;
  await member.save();
  req.app.get("io").to(`role:${member.role}`).emit("team:updated", safeUser(member));
  res.json(safeUser(member));
}
