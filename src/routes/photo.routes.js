import express from "express";
import { requireFirebaseUser } from "../middlewares/auth.middleware.js";
import {
  upload,
  uploadPhoto,
  getUserPhotos,
  deletePhoto,
  uploadDp,
} from "../controllers/photo.controller.js";

const router = express.Router();

/**
 * POST /api/photos/dp/:userId
 * Upload DP
 */
router.post("/dp/:userId", requireFirebaseUser, upload.single("photo"), uploadDp);

/**
 * POST /api/photos/:userId
 * Upload a gallery photo
 */
router.post("/:userId", requireFirebaseUser, upload.single("photo"), uploadPhoto);

/**
 * GET /api/photos/:userId
 * Get all gallery photos
 */
router.get("/:userId", requireFirebaseUser, getUserPhotos);

/**
 * DELETE /api/photos/:photoId
 * Delete a photo by ID
 */
router.delete("/:photoId", requireFirebaseUser, deletePhoto);

export default router;
