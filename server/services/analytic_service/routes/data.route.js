import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { analyzeFile } from "../controllers/analytic.controller.js";
import { graphFile } from "../controllers/chart.controller.js";

const router = express.Router();

// Simple test route
router.get("/data", (req, res) => {
  res.send("Data route is working");
});

// Main analytic route — analyzes uploaded file by ID
router.get("/analyzefile/:id", authMiddleware, analyzeFile);
router.post("/chartfile/:id", authMiddleware, graphFile);
export default router;
