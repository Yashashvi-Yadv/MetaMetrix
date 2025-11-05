import express from "express";
const app = express.Router();

import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  upload,
  file_upload,
  get_history,
  delete_history,
} from "../controllers/data.controller.js";
app.get("/data", (req, res) => {
  res.send("Data route is working");
});
app.post("/file-upload", authMiddleware, upload.single("file"), file_upload);
app.get("/get-history", authMiddleware, get_history);
app.delete("/delete-history/:id", authMiddleware, delete_history);
export default app;
