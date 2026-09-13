import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "./auth.repo.js";

export const userService = {
  registerUser: async (name, email, password, contact) => {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      contact,
    });
  },

  loginUser: async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT payload
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "1d" },
    );

    return { user, token };
  },
  //
  getUserProfile: async (id) => {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
};
