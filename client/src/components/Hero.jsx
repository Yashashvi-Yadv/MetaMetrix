// components/Hero.js - Unchanged
import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-bg-overlay"></div>
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Welcome to MetaMatrix</h1>
          <p className="hero-subtitle">
            Transform raw data into stunning insights with clean analytics,
            interactive graphs, and precise future predictions. Empower your
            decisions with elegance and precision.
          </p>
          <Link to="/signin" className="cta-button">
            <span>Launch Analytics</span>
          </Link>
        </div>
        <div className="hero-visual">
          <div className="visual-placeholder">
            <div className="analytics-icon chart-icon">📊</div>
            <div className="analytics-icon data-icon">📈</div>
            <div className="analytics-icon predict-icon">🔮</div>
          </div>
          <p className="visual-label">Analytics at Your Fingertips</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
