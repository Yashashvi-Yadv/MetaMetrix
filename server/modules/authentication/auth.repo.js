import { User } from "./auth.model.js";

export const userRepository = {
  createUser: async (userData) => {
    const user = new User(userData);
    return await user.save();
  },

  findUserByEmail: async (email) => {
    return await User.findOne({ email });
  },
  findUserById: async (id) => {
    return await User.findById(id).select("-password"); // Password mat bhejo
  },
};
