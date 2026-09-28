import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { listInvoices, redeemReward, walletOverview } from "../controllers/commerceController.js";

export const commerceRoutes = Router();
commerceRoutes.use(requireAuth);
commerceRoutes.get("/wallet", asyncHandler(walletOverview));
commerceRoutes.post("/wallet/redeem", asyncHandler(redeemReward));
commerceRoutes.get("/invoices", asyncHandler(listInvoices));
