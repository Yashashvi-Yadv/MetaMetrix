import express from "express";
import { userController } from "./auth.controller.js";
import { verifyToken } from "../../middleware/GlobalAuthMiddleware.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", verifyToken, userController.logout);
router.get("/me", verifyToken, userController.getMe);

export default router;
