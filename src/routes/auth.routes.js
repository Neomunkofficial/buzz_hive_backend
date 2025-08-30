// src/routes/auth.routes.js
import express from "express";
import { requireFirebaseUser } from "../middlewares/auth.middleware.js";
import { verifyFirebaseToken } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * POST /api/auth/verify-token
 * Headers: Authorization: Bearer <Firebase ID token>
 * Body: (optional)
 * Flow: Verifies token, upserts user in Postgres, returns user.
 */
router.post("/verify-token", requireFirebaseUser, verifyFirebaseToken);

export default router;
