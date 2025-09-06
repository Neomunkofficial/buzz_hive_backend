// src/routes/social.routes.js
import express from "express";
import { updateSocialLinks } from "../controllers/social.controller.js";
import { requireFirebaseUser  } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.patch("/socials", requireFirebaseUser, updateSocialLinks);

export default router;
