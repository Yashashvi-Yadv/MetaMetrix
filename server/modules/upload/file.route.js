import express from "express";
import { uploadController } from "./file.controller.js";
import { uploadFile } from "../../middleware/upload.middleware.js";
import { verifyToken } from "../../middleware/GlobalAuthMiddleware.js"; // Auth middleware banaya tha pichle step me

const router = express.Router();

router.post("/analyze", verifyToken, uploadFile, uploadController.handleUpload);
router.post("/chat", verifyToken, uploadController.handleChat);

export default router;
