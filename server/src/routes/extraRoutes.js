import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import {
  listTransactions,
  completePickupPayment,
} from "../controllers/transactionController.js";
import {
  createFeedback,
  listFeedback,
} from "../controllers/feedbackController.js";
import {
  nearbyCollectors,
  nearbyRecyclers,
} from "../controllers/nearbyController.js";
import {
  greenImpact,
  collectorStats,
} from "../controllers/greenImpactController.js";

export const extraRoutes = Router();
extraRoutes.use(requireAuth);
extraRoutes.get("/transactions", asyncHandler(listTransactions));
extraRoutes.post(
  "/transactions/pickup/:pickupId/pay",
  asyncHandler(completePickupPayment),
);
extraRoutes.get("/feedback", asyncHandler(listFeedback));
extraRoutes.post("/feedback", asyncHandler(createFeedback));
extraRoutes.get("/nearby/collectors", asyncHandler(nearbyCollectors));
extraRoutes.get("/nearby/recyclers", asyncHandler(nearbyRecyclers));
extraRoutes.get("/impact/green", asyncHandler(greenImpact));
extraRoutes.get("/stats/collector", asyncHandler(collectorStats));
