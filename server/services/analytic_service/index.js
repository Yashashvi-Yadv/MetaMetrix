import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/connectdb.js";
import dataroute from "./routes/data.route.js";
dotenv.config();

const app = express();

// ✅ Connect to MongoDB *before* handling routes
connectDB();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS setup
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"], // frontend origin, not backend
    credentials: true, // allow cookies
  })
);

// ✅ Routes
app.get("/", (req, res) => {
  res.send("hello from analytic api");
});

app.use(dataroute);
// ✅ Start server
const PORT = process.env.PORT || 8003;
app.listen(PORT, () => {
  console.log(`✅ DATA running on port ${PORT}`);
});
