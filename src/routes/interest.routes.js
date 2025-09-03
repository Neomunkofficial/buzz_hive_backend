import express from "express";
import { requireFirebaseUser } from "../middlewares/auth.middleware.js";
import {
  getAllInterests,
  addUserInterests,
  removeUserInterest,
} from "../controllers/interest.controller.js";

const router = express.Router();

/**
 * GET /api/interests
 * Fetch all interests
 */
router.get("/", requireFirebaseUser, getAllInterests);

/**
 * POST /api/interests/:userId
 * Add multiple interests to a user
 */
router.post("/:userId", requireFirebaseUser, addUserInterests);

/**
 * DELETE /api/interests/:userId/:interestId
 * Remove a specific interest from a user
 */
router.delete("/:userId/:interestId", requireFirebaseUser, removeUserInterest);

export default router;
