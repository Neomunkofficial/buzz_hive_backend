import express from "express";
import { requireFirebaseUser } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { assignRole } from "../controllers/admin.controller.js";

const router = express.Router();

/**
 * POST /api/admin/assign-role
 * Assign role to a user (only SUPER_ADMIN can do this)
 */
router.post(
  "/assign-role",
  requireFirebaseUser,
  checkRole(["SUPER_ADMIN"]),
  assignRole
);

export default router;
