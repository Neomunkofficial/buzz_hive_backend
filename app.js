// app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./src/routes/auth.routes.js";
import errorHandler from "./src/middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_, res) => res.json({ ok: true }));

// API routes
app.use("/api/auth", authRoutes);

// central error handler
app.use(errorHandler);

export default app;
