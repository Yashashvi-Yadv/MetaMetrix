// App.js - Unchanged
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SignIn from "./pages/static/SignIn";
import "./App.css";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./utils/Protected";
import Dashboard from "./components/Dashboard";
import DataUpload from "./ProtectedPages/DataUpload";
import Analytic from "./ProtectedPages/Analytic";
import ViewReports from "./ProtectedPages/ViewReports";
const Home = () => {
  return (
    <div className="page-content">
      <Hero />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/dataupload/"
            element={
              <ProtectedRoute>
                <DataUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/viewreports/"
            element={
              <ProtectedRoute>
                <ViewReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/analytic/:id"
            element={
              <ProtectedRoute>
                <Analytic />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </Router>
  );
};

export default App;
