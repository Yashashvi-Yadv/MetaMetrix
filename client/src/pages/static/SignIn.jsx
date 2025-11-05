import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      const res = await axios.post(
        `${import.meta.env.VITE_AUTH_URL}auth/google/login`,
        { token },
        { withCredentials: true } // <-- send cookie
      );

      if (res.data.success) {
        toast.success("Login Success ✅");
        navigate("/dashboard");
        window.location.reload();
      } else {
        toast.error("Login Failed ❌");
      }
    } catch (err) {
      toast.error("Login Failed ❌");
      console.error("Auth Error:", err.response?.data || err);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Authentication Failed ❌");
  };

  return (
    <div className="signin-card">
      <h2>Sign in to MetaMatrix</h2>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
    </div>
  );
};

export default SignIn;
