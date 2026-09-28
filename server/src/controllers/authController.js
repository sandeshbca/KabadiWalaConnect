import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  phone: user.phone,
  role: user.role,
  verified: user.verified,
  active: user.active,
  location: user.location,
  walletBalance: user.walletBalance || 0,
  rewardPoints: user.rewardPoints || 0,
  referralCode: user.referralCode,
});
const issueToken = (user) =>
  jwt.sign({ role: user.role }, process.env.JWT_SECRET || "development-only-change-this-before-production", {
    subject: user.id,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
function createReferralCode(name, phone) {
  const initials = String(name || "SCRAP").replace(/[^a-z]/gi, "").slice(0, 5).toUpperCase() || "SCRAP";
  return `${initials}${String(phone || "").slice(-4)}`;
}

export async function register(req, res) {
  const { name, phone, password, role = "citizen", location, referralCode } = req.body;
  if (!name || !phone || !password)
    return res
      .status(400)
      .json({ message: "Name, phone and password are required" });
  if (!["citizen", "collector", "recycler", "dealer"].includes(role))
    return res.status(400).json({ message: "Invalid role" });
  const user = await User.create({
    name,
    phone,
    password,
    role,
    location,
    referralCode: createReferralCode(name, phone),
  });
  if (referralCode) {
    const referrer = await User.findOne({ referralCode: String(referralCode).trim().toUpperCase() });
    if (referrer && String(referrer._id) !== String(user._id)) {
      referrer.rewardPoints = (referrer.rewardPoints || 0) + 250;
      referrer.walletBalance = (referrer.walletBalance || 0) + 25;
      referrer.referralCount = (referrer.referralCount || 0) + 1;
      await referrer.save();
      user.rewardPoints = (user.rewardPoints || 0) + 100;
      await user.save();
    }
  }
  const token = issueToken(user);
  res.status(201).json({ token, user: publicUser(user) });
}
export async function login(req, res) {
  const { phone, password } = req.body;
  if (!phone || !password)
    return res.status(400).json({ message: "Phone and password are required" });
  const user = await User.findOne({ phone }).select("+password");
  if (!user || !(await user.comparePassword(password)))
    return res
      .status(401)
      .json({ message: "Invalid phone number or password" });
  if (user.active === false)
    return res.status(403).json({ message: "This account has been paused. Please contact your administrator." });
  const token = issueToken(user);
  res.json({ token, user: publicUser(user) });
}
export async function profile(req, res) {
  res.json({ user: publicUser(req.user) });
}
