import express from "express";
import { requireFirebaseUser } from "../middlewares/auth.middleware.js";
import {
  upload,
  uploadPhoto,
  getUserPhotos,
  deletePhoto,
} from "../controllers/photo.controller.js";

const router = express.Router();

/**
 * POST /api/photos/:userId
 * Upload a new photo (DP or gallery)
 */
router.post("/:userId", requireFirebaseUser, upload.single("photo"), uploadPhoto);

/**
 * GET /api/photos/:userId
 * Get all photos for a user
 */
router.get("/:userId", requireFirebaseUser, getUserPhotos);

/**
 * DELETE /api/photos/:photoId
 * Delete a photo by ID
 */
router.delete("/:photoId", requireFirebaseUser, deletePhoto);

export default router;
