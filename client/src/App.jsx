import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext"; // <-- Import Provider
import Header from "./components/Header";
import Footer from "./components/Footer";
import MetaMetrixLanding from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard"; // <-- Import Dashboard

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Provider Wrap */}
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
          <Header />

          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<MetaMetrixLanding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
