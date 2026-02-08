import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./LandingPage";
import Dashboard from "./pages/Dashboard"; // management dashboard
import Profile from "./pages/Profile";
import CustomerDashboard from "./pages/CustomerDashboard"; // new customer dashboard
import "./App.css";

function AppWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation();

  // Load login state and role from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, []);

  // hide navbar on dashboards/profile if needed
  const hideNavbar =
    location.pathname === "/dashboard" ||
    location.pathname === "/profile" ||
    location.pathname === "/customer-dashboard";

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setRole={setRole} // pass setRole for logout
        hideLinks={hideNavbar} // optional
      />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth Pages */}
        <Route
          path="/login"
          element={
            <div className="form-container">
              <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="form-container">
              <Register setIsLoggedIn={setIsLoggedIn} />
            </div>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn && role === "management" ? (
              <Dashboard setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/customer-dashboard"
          element={
            isLoggedIn && role === "customer" ? (
              <CustomerDashboard setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isLoggedIn && role === "customer" ? (
              <Profile setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
            ) : isLoggedIn && role === "management" ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
