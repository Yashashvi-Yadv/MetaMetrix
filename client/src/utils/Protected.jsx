import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/google/check", {
          withCredentials: true,
        });
        setAuthenticated(res.data.authenticated);
        if (res.data.authenticated) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!authenticated) return <Navigate to="/signin" replace />;

  return children;
};

export default ProtectedRoute;
