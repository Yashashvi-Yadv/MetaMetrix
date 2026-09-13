import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authroute from "./modules/authentication/auth.router.js";
import { connectDB } from "./Config/connetdb.js";
import uploadRoute from "./modules/upload/file.route.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: " Backend is running",
  });
});

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
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Monolithic Backend running on port ${PORT}`);
});
