import prisma from "../../config/prisma.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup local storage (uploads/user_photos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/user_photos";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const upload = multer({ storage });

/**
 * Upload a new gallery photo
 */
export const uploadPhoto = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const photo = await prisma.userPhoto.create({
      data: {
        user_id: BigInt(userId),
        url: `/uploads/user_photos/${req.file.filename}`,
      },
    });

    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all gallery photos for a user
 */
export const getUserPhotos = async (req, res) => {
  try {
    const { userId } = req.params;

    const photos = await prisma.userPhoto.findMany({
      where: { user_id: BigInt(userId) },
    });

    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a user photo
 */
export const deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    const photo = await prisma.userPhoto.delete({
      where: { photo_id: parseInt(photoId) },
    });

    // remove file from local storage
    if (fs.existsSync(`.${photo.url}`)) {
      fs.unlinkSync(`.${photo.url}`);
    }

    res.json({ message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload DP (single profile picture)
 */
export const uploadDp = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dpUrl = `/uploads/user_photos/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { user_id: BigInt(userId) },
      data: { dp: dpUrl },
    });

    res.json({ dp: dpUrl, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
