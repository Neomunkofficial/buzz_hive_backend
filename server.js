// app.js - Updated with user routes
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// load environment variables
dotenv.config();

import authRoutes from "./src/routes/auth.routes.js";
import collegeRoutes from "./src/routes/college.routes.js";
import userRoutes from "./src/routes/user.routes.js"; // Add this
import postRoutes from "./src/routes/post.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";

const app = express();

// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(morgan("dev"));

// static folder for serving uploaded files
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/users", userRoutes); // Add this line
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);

// base route
app.get("/", (req, res) => {
  res.send("✅ Buzz Hive API is running");
});

// server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});