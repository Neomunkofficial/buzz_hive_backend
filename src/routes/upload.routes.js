import express from "express";
import {
  uploadICard,
  uploadDp,
  uploadPhotos,
  handleUpload,
} from "../controllers/upload.controller.js";

const router = express.Router();

// ✅ Upload I-Card (front/back)
router.post(
  "/icard/:phone",
  uploadICard.single("icard"),
  handleUpload("icard", "I-Card")
);

// ✅ Upload DP
router.post(
  "/dp/:phone",
  uploadDp.single("photo"),
  handleUpload("dp", "DP")
);

// ✅ Upload Photos (multiple, max 6)
router.post(
  "/photos/:phone",
  uploadPhotos.array("photo", 6),
  handleUpload("photos", "Gallery Photos")
);

export default router;
