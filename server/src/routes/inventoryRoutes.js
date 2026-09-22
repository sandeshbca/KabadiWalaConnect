import { Router } from "express";
import {
  createInventory,
  listInventory,
  reserveInventory,
  updateInventoryStatus,
} from "../controllers/inventoryController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { upload } from "../middleware/upload.js";
export const inventoryRoutes = Router();
inventoryRoutes.use(requireAuth);
inventoryRoutes.get("/", allowRoles("collector", "recycler", "admin"), asyncHandler(listInventory));
inventoryRoutes.post(
  "/",
  allowRoles("collector", "admin"),
  upload.single("image"),
  asyncHandler(createInventory),
);
inventoryRoutes.post(
  "/:id/reserve",
  allowRoles("recycler"),
  asyncHandler(reserveInventory),
);
inventoryRoutes.patch(
  "/:id/status",
  allowRoles("collector", "admin"),
  asyncHandler(updateInventoryStatus),
);
