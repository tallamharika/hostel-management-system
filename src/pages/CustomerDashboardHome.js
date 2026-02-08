// src/pages/CustomerDashboardHome.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerDashboardHome() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("Student");

  // ✅ Simulated fetch for logged-in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("studentUser"));
    if (storedUser && storedUser.name) {
      setStudentName(storedUser.name);
    }
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>🎉 Welcome, {studentName}!</h2>
      <p>
        From here, you can view your <b>Dashboard</b>, check your{" "}
        <b>Fee Tracking</b>, and manage your <b>Bookings</b>.
      </p>

      <div style={{ marginTop: "30px" }}>
        <button
          style={btnStyle}
          onClick={() => navigate("/dashboard/feetracking")}
        >
          💰 View Fee Tracking
        </button>
        <button
          style={{ ...btnStyle, backgroundColor: "#00b894" }}
          onClick={() => navigate("/dashboard/bookings")}
        >
          🏠 My Bookings
        </button>
        <button
          style={{ ...btnStyle, backgroundColor: "#0984e3" }}
          onClick={() => navigate("/hostels")}
        >
          🏢 Browse Hostels
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  marginRight: "15px",
  padding: "10px 20px",
  backgroundColor: "#3751ff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default CustomerDashboardHome;
