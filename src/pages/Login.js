// src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../App.css";
import "../auth.css";

function Login({ setIsLoggedIn, setRole }) {
  const [role, setLocalRole] = useState("customer"); // UI toggle only
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) return;

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/auth/login", {
  email,
  password,
  selectedRole: role, // 👈 VERY IMPORTANT
});


      console.log("🔑 Login response:", res.data);

      const { token, role: backendRole, userId } = res.data;

      // 🔐 Save auth data
      localStorage.setItem("token", token);
      localStorage.setItem("role", backendRole);
      if (userId) {
        localStorage.setItem("userId", userId);
      }

      setIsLoggedIn(true);
      setRole(backendRole);        // update AppWrapper
      setLocalRole(backendRole);   // sync UI toggle

      setSuccess("✅ Login successful! Redirecting...");

      setTimeout(() => {
        if (backendRole === "management") {
          navigate("/dashboard");
        } else if (backendRole === "customer") {
          navigate("/customer-dashboard");
        } else {
          navigate("/");
        }
      }, 500);

    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);

      if (err.response?.status === 404) {
        setMessage("❌ You are not registered. Please register first.");
      } else if (err.response?.status === 401) {
        setMessage("❌ Invalid email or password.");
      } else {
        setMessage("❌ Login failed. Try again.");
      }
    }
  };

  return (
    <div className="login-wrapper">
      {/* Role Toggle */}
      <div className="role-toggle">
        <button
          type="button"
          className={role === "customer" ? "active" : ""}
          onClick={() => setLocalRole("customer")}
        >
          Customer
        </button>
        <button
          type="button"
          className={role === "management" ? "active" : ""}
          onClick={() => setLocalRole("management")}
        >
          Hostel Management
        </button>
      </div>

      {/* Customer Login */}
      {role === "customer" && (
        <div className="form-container">
          <h2>Customer Login</h2>
          <form className="auth-form" onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>

          {message && <p className="error-message">{message}</p>}
          {success && <p className="success-message">{success}</p>}

          <p>
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      )}

      {/* Management Login */}
      {role === "management" && (
        <div className="form-container">
          <h2>Hostel Management Login</h2>
          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email (registered)"
              required
            />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>

          {message && <p className="error-message">{message}</p>}
          {success && <p className="success-message">{success}</p>}

          <p>
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default Login;