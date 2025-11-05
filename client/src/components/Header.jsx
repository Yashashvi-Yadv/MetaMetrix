import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import axios from "axios";
import { toast } from "react-hot-toast";
const Header = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User" };
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setAuthenticated(authStatus);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const res = await axios.get("http://localhost:5000/auth/google/logout");
    if (res.data.success) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      toast.success(res.data.message);
      setAuthenticated(false);
      setDropdownOpen(false);
      navigate("/signin");
    }
    returnl;
  };

  return (
    <header className="header">
      <div className="nav">
        {/* Logo with Gradient Text */}
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1 className="logo-text">MetaMatrix</h1>
          </Link>
        </div>

        {/* Auth State */}
        {authenticated ? (
          <div className="profile-container" ref={dropdownRef}>
            <div
              className="profile-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img src={user.picture} alt="Profile" className="profile-img" />
              <span className="profile-name">Hi, {user.name}</span>
              <svg
                className={`chevron ${dropdownOpen ? "open" : ""}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleLogout}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className="sign-in-button">
            <span>Sign In</span>
            <svg
              className="btn-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
