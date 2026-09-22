import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;
    if (!token)
      return res.status(401).json({ message: "Authentication required" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user)
      return res.status(401).json({ message: "Account no longer exists" });
    if (user.active === false)
      return res.status(403).json({ message: "This account has been paused. Please contact your administrator." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}
export function allowRoles(...roles) {
  return (req, res, next) =>
    roles.includes(req.user.role)
      ? next()
      : res
          .status(403)
          .json({ message: "You do not have permission for this action" });
}
