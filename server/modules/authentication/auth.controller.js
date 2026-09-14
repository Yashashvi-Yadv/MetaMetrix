import { userService } from "./auth.service.js";

export const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password, contact } = req.body;
      await userService.registerUser(name, email, password, contact);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await userService.loginUser(email, password);

      // Set JWT in HttpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // true if on HTTPS
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  },

  logout: (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  },

  getMe: async (req, res) => {
    try {
      // req.user.id hume auth middleware se mil raha hai
      const user = await userService.getUserProfile(req.user.id);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },
};
