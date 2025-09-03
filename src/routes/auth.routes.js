// backend/routes/auth.routes.js
import express from "express";
import { loginUser, signupUser } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * POST /api/auth/login
 * Body: { phone, password }
 * Response: { token, user }
 */
router.post("/login", loginUser);

/**
 * POST /api/auth/signup
 * Body: { phone, otp }
 * Response: { token, user }
 */
router.post("/signup", signupUser);

export default router;
