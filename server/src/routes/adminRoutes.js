import { Router } from "express";
import { listTeam, updateTeamMember } from "../controllers/adminController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";

export const adminRoutes = Router();
adminRoutes.use(requireAuth, allowRoles("admin"));
adminRoutes.get("/team", asyncHandler(listTeam));
adminRoutes.patch("/team/:id", asyncHandler(updateTeamMember));
