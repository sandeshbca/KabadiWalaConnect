import { Router } from "express";
import { overview } from "../controllers/analyticsController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
export const analyticsRoutes = Router();
analyticsRoutes.get(
  "/overview",
  requireAuth,
  allowRoles("recycler", "admin"),
  asyncHandler(overview),
);
