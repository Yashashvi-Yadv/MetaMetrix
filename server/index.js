import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authroute from "./modules/authentication/auth.router.js";
import uploadRoute from "./modules/upload/file.route.js";
import { connectDB } from "./Config/connetdb.js";

dotenv.config();

const app = express();

// Proxy setting sabse upar honi chahiye (Render/Vercel/Heroku ke liye)
app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;

// Env variable se trailing slash hatane ke liye (e.g. '/' at the end)
const allowedOrigin = process.env.ORIGIN;

const corsOptions = {
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Zaroori hai cookies backend tak aane dene ke liye
};

// Middlewares Setup
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle Preflight requests

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running flawlessly",
  });
});

// Routes
app.use("/api/auth", authroute);
app.use("/api/upload", uploadRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Error Logged:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Monolithic Backend running on port ${PORT}`);
});
