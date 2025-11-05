// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Safe render: user is guaranteed to exist here
  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Welcome, {user.name || "User"}!</h2>
        <p className="dashboard-subtitle">
          Your analytics hub – clean data, visual insights, predictions.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dash-card">
          <div className="card-icon">Chart</div>
          <h3>Clean Analytics</h3>
          <p>Upload CSV to instant stats (mean, std-dev, outliers).</p>
        </div>

        <div className="dash-card">
          <div className="card-icon">Graph</div>
          <h3>Interactive Graphs</h3>
          <p>Bar, line, scatter – powered by Chart.js.</p>
        </div>

        <div className="dash-card">
          <div className="card-icon">Prediction</div>
          <h3>Future Predictions</h3>
          <p>Linear regression to next 3 periods.</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link className="action-btn primary" to="/dashboard/dataupload">
          Upload Dataset
        </Link>

        <Link className="action-btn primary" to="/dashboard/viewreports">
          View Report{" "}
        </Link>
      </div>
    </section>
  );
};

export default Dashboard;
