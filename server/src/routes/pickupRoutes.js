import { Router } from "express";
import {
  createPickup,
  listPickups,
  updatePickupStatus,
} from "../controllers/pickupController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { upload } from "../middleware/upload.js";
export const pickupRoutes = Router();
pickupRoutes.use(requireAuth);
pickupRoutes.get("/", asyncHandler(listPickups));
pickupRoutes.post(
  "/",
  allowRoles("citizen", "admin"),
  upload.single("image"),
  asyncHandler(createPickup),
);
pickupRoutes.patch(
  "/:id/status",
  allowRoles("collector", "recycler", "admin"),
  asyncHandler(updatePickupStatus),
);
