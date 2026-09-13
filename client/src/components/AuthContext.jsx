import React, { createContext, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. App start hote hi synchronously check karo ki token aur user hai ya nahi
  // Isko "Lazy Initialization" bolte hain React mein
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = Cookies.get("token");
    const savedUser = localStorage.getItem("user");
    // Agar dono hain toh first render se hi 'true' rahega, warna 'false'
    return !!(token && savedUser);
  });

  const login = (token, userData) => {
    Cookies.set("token", token, { expires: 7 });
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
