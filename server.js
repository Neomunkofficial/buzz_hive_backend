// server.js
import dotenv from "dotenv";
// Load environment variables FIRST, before any other imports
dotenv.config();

// Now import other modules
import express from "express";
import authTestRoutes from "./src/routes/auth.test.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authTestRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});