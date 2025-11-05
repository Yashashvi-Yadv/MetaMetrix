import express from "express";
const app = express.Router();

import { checkAuth, signup, test, logout } from "../controllers/googleAuth.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
app.get("/google", (req, res) => {
  res.send("hello from authentication google api");
});
app.post("/google/login/", signup);
app.get("/google/get", test);
app.get("/google/check", checkAuth);
app.get("/google/logout", logout);
export default app;
