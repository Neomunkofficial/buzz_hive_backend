// src/routes/upload.routes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadICard } from "../controllers/upload.controller.js";

const router = express.Router();

// dynamic storage for I-Card
const storageICard = multer.diskStorage({
  destination: (req, file, cb) => {
    const phone = req.params.phone; // take phone number from URL param
    const userFolder = path.join("uploads", phone, "icard");

    // create folder if not exists
    fs.mkdirSync(userFolder, { recursive: true });

    cb(null, userFolder);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const uploadProfilePost = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // default uploads folder
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          path.extname(file.originalname)
      );
    },
  }),
});

const uploadICardMulter = multer({ storage: storageICard });

// upload profile photo
router.post("/profile", uploadProfilePost.single("photo"), (req, res) => {
  res.json({
    message: "Profile photo uploaded successfully",
    fileUrl: `/uploads/${req.file.filename}`,
  });
});

// upload post image
router.post("/post", uploadProfilePost.single("image"), (req, res) => {
  res.json({
    message: "Post image uploaded successfully",
    fileUrl: `/uploads/${req.file.filename}`,
  });
});

// upload I-Card → stored in uploads/{phone}/icard/
router.post("/icard/:phone", uploadICardMulter.single("icard"), (req, res) => {
  const phone = req.params.phone;
  res.json({
    message: "I-Card uploaded successfully",
    fileUrl: `/uploads/${phone}/icard/${req.file.filename}`,
  });
});

export default router;
