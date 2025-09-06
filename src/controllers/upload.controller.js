import multer from "multer";
import path from "path";
import fs from "fs";

// 🔹 helper: make folder if not exists
const makeDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

// 🔹 dynamic storage generator
const createStorage = (subfolder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const { phone } = req.params;
      if (!phone) {
        return cb(new Error("Phone number is required"), null);
      }
      const dir = path.join("uploads", phone, subfolder);
      makeDir(dir);
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

// 🔹 Multers for each type
export const uploadICard = multer({ storage: createStorage("icard") });
export const uploadDp = multer({ storage: createStorage("dp") });
export const uploadPhotos = multer({ storage: createStorage("photos") });

// 🔹 Controllers
export const handleUpload = (subfolder, fileField) => (req, res) => {
  if (!req.file && !req.files) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { phone } = req.params;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  if (req.file) {
    // single file (dp, icard)
    const fileUrl = `/uploads/${phone}/${subfolder}/${req.file.filename}`;
    return res.json({
      message: `${fileField} uploaded successfully`,
      fileUrl,
    });
  }

  if (req.files) {
    // multiple photos
    const fileUrls = req.files.map(
      (f) => `/uploads/${phone}/${subfolder}/${f.filename}`
    );
    return res.json({
      message: `${fileField} uploaded successfully`,
      fileUrls,
    });
  }
};
