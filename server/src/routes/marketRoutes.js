import { Router } from "express";
import {
  createMarketPrice,
  listMarketPrices,
  updateMarketPrice,
} from "../controllers/marketController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";

export const marketRoutes = Router();
marketRoutes.use(requireAuth);
marketRoutes.get(
  "/prices",
  allowRoles("collector", "recycler", "admin"),
  asyncHandler(listMarketPrices),
);
marketRoutes.post(
  "/prices",
  allowRoles("admin"),
  asyncHandler(createMarketPrice),
);
marketRoutes.patch(
  "/prices/:id",
  allowRoles("admin"),
  asyncHandler(updateMarketPrice),
);
