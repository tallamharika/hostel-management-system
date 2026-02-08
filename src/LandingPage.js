import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
function LandingPage() {
  return (
    <div className="landing-container">
      {/* ✅ Navbar comes from separate component */}
      <Navbar />

      {/* Hero Section */}
      <header className="hero-section" id="home">
        <div className="hero-overlay">
          <div className="landing-text">
            <h1>Welcome to Smart Hostel Management</h1>
            <p>
              Manage your hostel with ease — rooms, fees, records, all in one place!
            </p>
            <div className="button-group">
              <Link to="/register">
                <button className="nav-btn">Start Journey</button>
              </Link>
              <Link to="/login">
                <button className="nav-btn secondary">Login</button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      
    </div>
  );
}

export default LandingPage;
