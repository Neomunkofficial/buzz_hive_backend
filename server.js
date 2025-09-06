import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

// ✅ Global BigInt fix
BigInt.prototype.toJSON = function () {
  return this.toString();
};

import authRoutes from "./src/routes/auth.routes.js";
import collegeRoutes from "./src/routes/college.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import photoRoutes from "./src/routes/photo.routes.js";
import socialRoutes from "./src/routes/social.routes.js";

const app = express();

// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(morgan("dev"));

// static folder
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/socials", socialRoutes); // ✅ fixed

// base route
app.get("/", (req, res) => {
  res.send("✅ Buzz Hive API is running");
});

// server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
