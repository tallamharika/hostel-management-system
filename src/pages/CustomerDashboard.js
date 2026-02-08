// src/pages/CustomerDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaBook, FaClipboardList } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import "./CustomerDashboard.css";
import Hostels from "../components/Hostels";
import Bookings from "../components/Bookings";
import FeeTracking from "../components/FeeTracking";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState("dashboard"); // "dashboard", "hostels", "bookings", "feetracking"

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (!userId || role !== "customer") {
      alert("Unauthorized. Please login as Customer.");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="customerdashboard-wrapper">
      {/* Left Sidebar */}
      <aside className="customersidebar">
        <h2 className="customersidebar-title">Customer</h2>
        <div className="customersidebar-links">
          <button
            className="customersidebar-btn"
            onClick={() => setView("dashboard")}
          >
            <FaHome /> Dashboard
          </button>
          <button
            className="customersidebar-btn"
            onClick={() => setView("hostels")}
          >
            🏨 Hostels
          </button>
          <button
            className="customersidebar-btn"
            onClick={() => setView("bookings")}
          >
            <FaBook /> My Bookings
          </button>
          <button
            className="customersidebar-btn"
            onClick={() => setView("feetracking")}
          >
            <FaClipboardList /> FEE Tracking
          </button>
        </div>
      </aside>

      {/* Main Dashboard */}
      <div className="customer-dashboard-container">
        {/* Top Navbar */}
        <nav className="customertop-navbar">
          <div className="customertop-navbar-links">
            <button
              className="customernavbar-btn"
              onClick={() => navigate("/home")}
            >
              <FaHome /> Home
            </button>
            <button
              className="customernavbar-btn"
              onClick={() => navigate("/profile")}
            >
              <FaUser /> My Profile
            </button>
            <button className="customernavbar-btn" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="customermain-content">
          {view === "dashboard" && (
            <div className="dashboard1-wrapper-vertical">
              <div className="dashboard1-card-vertical">
                <div className="dashboard1-info">
                  <h3>🎉 Welcome to Customer Dashboard</h3>
                  <p>
                    From here you can view your profile and manage your account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {view === "hostels" && <Hostels />}
          {view === "bookings" && <Bookings />}
          {view === "feetracking" && <FeeTracking />}
        </main>
      </div>
    </div>
  );
}

export default CustomerDashboard;
