import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isLoggedIn, setIsLoggedIn, setRole }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar completely on dashboard or profile pages
  const hideNavbar = ["/dashboard", "/customer-dashboard", "/profile"].includes(location.pathname);
  if (hideNavbar) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    setIsLoggedIn(false);
    setRole(null);

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2 className="logo" onClick={() => navigate("/")}>MySite</h2>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className="auth-buttons">
          {isLoggedIn && location.pathname === "/" && (
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          )}

          {!isLoggedIn && location.pathname === "/" && (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
