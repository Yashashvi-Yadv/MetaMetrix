import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Cookie parser se token nikalna
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key",
    );
    req.user = decoded;
    next(); // Aage route ki taraf bhejo
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
