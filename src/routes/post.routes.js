import express from "express";
import {
  createPost,
  createEvent,
  getCollegeFeed,
  toggleLike,
  addComment,
} from "../controllers/post.controller.js";

import { requireFirebaseUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(requireFirebaseUser);

// Posts
router.post("/", requireRole(["STUDENT", "COLLEGE_ADMIN", "SUPER_ADMIN"]), createPost);

// Events
router.post("/event", requireRole(["COLLEGE_ADMIN", "SUPER_ADMIN"]), createEvent);

// Feed
router.get("/college/:collegeId", getCollegeFeed);

// Like/unlike
router.post("/:postId/like", toggleLike);

// Comment
router.post("/:postId/comment", addComment);

export default router;
