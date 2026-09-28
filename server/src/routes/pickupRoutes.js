import { Router } from "express";
import {
  assignPickupToRecycler,
  createPickup,
  listPickups,
  recordDigitalWeight,
  updatePickupStatus,
  verifyPickupQr,
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
  allowRoles("collector", "dealer", "recycler", "admin"),
  asyncHandler(updatePickupStatus),
);
pickupRoutes.patch(
  "/:id/weight",
  allowRoles("collector", "dealer", "admin"),
  asyncHandler(recordDigitalWeight),
);
pickupRoutes.post(
  "/:id/verify-qr",
  allowRoles("collector", "dealer", "admin"),
  asyncHandler(verifyPickupQr),
);
pickupRoutes.post(
  "/:id/assign-recycler",
  allowRoles("collector", "dealer", "admin"),
  asyncHandler(assignPickupToRecycler),
);
