// src/controllers/upload.controller.js
import multer from "multer";
import path from "path";
import fs from "fs";

// dynamic storage: uploads/<phone>/icard/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { phone } = req.params;
    if (!phone) {
      return cb(new Error("Phone number is required"), null);
    }

    const dir = path.join("uploads", phone, "icard");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
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

export const upload = multer({ storage });

export const uploadICard = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileUrl = `/uploads/${req.params.phone}/icard/${req.file.filename}`;
  res.json({
    message: "I-Card uploaded successfully",
    fileUrl,
  });
};
