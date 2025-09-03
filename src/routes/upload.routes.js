import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // store files in uploads folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// upload profile photo
router.post("/profile", upload.single("photo"), (req, res) => {
  res.json({
    message: "Profile photo uploaded successfully",
    fileUrl: `/uploads/${req.file.filename}`,
  });
});

// upload post image
router.post("/post", upload.single("image"), (req, res) => {
  res.json({
    message: "Post image uploaded successfully",
    fileUrl: `/uploads/${req.file.filename}`,
  });
});

export default router;
