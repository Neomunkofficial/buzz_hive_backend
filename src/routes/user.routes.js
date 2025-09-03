// src/routes/user.routes.js
import express from "express";
import { requireFirebaseUser } from "../middlewares/auth.middleware.js";
import { 
  getUserById, 
  updateUserProfile, 
  assignUserToCollege, 
  getUserProfileWithCollege,
  updateOnboardingData
} from "../controllers/user.controller.js";

const router = express.Router();

/**
 * GET /api/users/:id
 * Fetch user details by ID (with profile, photos, interests)
 */
router.get("/:id", requireFirebaseUser, getUserById);

/**
 * PUT /api/users/:id
 * Update user profile info
 */
router.put("/:id", requireFirebaseUser, updateUserProfile);

/**
 * PUT /api/users/:id/assign
 * Assign user to college/department/branch/batch
 */
router.put("/:id/assign", requireFirebaseUser, assignUserToCollege);

/**
 * GET /api/users/:id/profile
 * Fetch user profile with college, dept, branch, batch
 */
router.get("/:id/profile", requireFirebaseUser, getUserProfileWithCollege);

/**
 * PATCH /api/users/onboarding
 * Update onboarding data - called from the final onboarding screen
 */
router.patch("/onboarding", requireFirebaseUser, updateOnboardingData);

export default router;