import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false); // Mobile menu close karo
    navigate("/login");
  };

  return (
    <header className="w-full px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            Meta<span className="text-blue-600">Metrix</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                <span className="text-slate-900 font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-semibold"
              >
                Register Account
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-slate-100 flex flex-col space-y-3 pt-4">
          <Link
            to="/"
            className="block text-slate-600 font-medium px-2 py-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="block text-slate-600 font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="px-2 py-2 border-t border-slate-100 mt-2">
                <span className="block text-slate-900 font-bold mb-3">
                  Hi, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-center"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-slate-600 font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-blue-600 font-bold px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register Account
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
