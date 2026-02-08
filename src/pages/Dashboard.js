// Dashboard.js
import React, { useState, useEffect } from "react"; // ✅ added useEffect
import { Link, useNavigate } from "react-router-dom";
import {
  FaBed,
  FaUsers,
  FaFileInvoiceDollar,
  FaHome,
  FaFileInvoice,
  FaInfoCircle,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { FiSettings, FiLogOut, FiPower } from "react-icons/fi";

import "./Dashboard.css";
import ManageRooms from "./sections/ManageRooms";
import NewStudent from "./sections/NewStudent";
import UpdateDeleteStudent from "./sections/UpdateDeleteStudent";
import StudentFees from "./sections/StudentFees";
import AllStudents from "./sections/AllStudents";
import LeavedStudents from "./sections/LeavedStudents";
import NewEmployee from "./sections/NewEmployee";
import EmployeePayment from "./sections/EmployeePayment";
import UpdateAndDeleteEmployee from "./sections/UpdateAndDeleteEmployee";
import AllEmployeeWorking from "./sections/AllEmployeeWorking";
import LeavedEmployee from "./sections/LeavedEmployee";

function Dashboard({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(""); // track selected section

  // ✅ Protect dashboard: redirect if not logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  // Sidebar Menu
  const defaultMenu = [
    { name: "Manage Rooms", icon: <FaBed />, type: "section" },
    { name: "New Student", icon: <FaUsers />, type: "section" },
    { name: "Update&Delete Student ", icon: <FaUsers />, type: "section" },
    { name: "Student Fees", icon: <FaFileInvoiceDollar />, type: "section" },
    { name: "All Students Living", icon: <FaUsers />, type: "section" },
    { name: "Leaved Students", icon: <FaUsers />, type: "section" },
    { name: "New Employee", icon: <FaUsers />, type: "section" },
    { name: "Update&Delete Employee", icon: <FaUsers />, type: "section" },
    { name: "Employee Payment", icon: <FaFileInvoiceDollar />, type: "section" },
    { name: "All Employee Working", icon: <FaUsers />, type: "section" },
    { name: "Leaved Employee", icon: <FaUsers />, type: "section" },
  ];

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("userId"); // ✅ remove userId on logout
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Section renderer
  const renderSection = () => {
    let content = null;
    if (active === "Manage Rooms") content = <ManageRooms />;
    else if (active === "New Student") content = <NewStudent />;
    else if (active.trim() === "Update&Delete Student") content = <UpdateDeleteStudent />;
    else if (active === "Student Fees") content = <StudentFees />;
    else if (active === "All Students Living") content = <AllStudents />;
    else if (active === "Leaved Students") content = <LeavedStudents />;
    else if (active === "New Employee") content = <NewEmployee />;
    else if (active === "Employee Payment") content = <EmployeePayment />;
    else if (active === "Update&Delete Employee") content = <UpdateAndDeleteEmployee />;
    else if (active === "All Employee Working") content = <AllEmployeeWorking />;
    else if (active === "Leaved Employee") content = <LeavedEmployee />;
    else content = <h2 style={{ color: "white", textAlign: "center" }}>Welcome to Dashboard</h2>;

    // Default background image when no section is active
    return (
      <div
        className="section-background"
        style={{
          width: "100%",
          height: "calc(100vh - 80px)",
          backgroundImage: 'url("/images/dashboard1-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div style={{ backgroundColor: "transparent" }}>{content}</div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">SmartHostel</h2>
        <ul className="menu">
          {defaultMenu.map((item) =>
            item.type === "section" ? (
              <li
                key={item.name}
                className={active === item.name ? "active" : ""}
                onClick={() => setActive(item.name)}
              >
                <span className="icon">{item.icon}</span>
                <span className="text">{item.name}</span>
              </li>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <li className={active === item.name ? "active" : ""}>
                  <span className="icon">{item.icon}</span>
                  <span className="text">{item.name}</span>
                </li>
              </Link>
            )
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Navbar */}
        <nav className="top-navbar">
          <div className="top-navbar-links">
            <Link to="/home" className="navbar-link">
              <FaHome style={{ marginRight: "5px" }} /> Home
            </Link>
            <Link to="/features" className="navbar-link">
              <FiSettings style={{ marginRight: "5px" }} /> Features
            </Link>
            <Link to="/pricing" className="navbar-link">
              <FaFileInvoice style={{ marginRight: "5px" }} /> Pricing
            </Link>
            <Link to="/about" className="navbar-link">
              <FaInfoCircle style={{ marginRight: "5px" }} /> About
            </Link>
            <Link to="/contact" className="navbar-link">
              <FaPhone style={{ marginRight: "5px" }} /> Contact
            </Link>

            {/* Logged-in actions */}
            <Link to="/profile" className="navbar-link">
              <FaUser style={{ marginRight: "5px" }} /> Profile
            </Link>
            <button className="navbar-link" onClick={handleLogout}>
              <FiLogOut style={{ marginRight: "5px" }} /> Logout
            </button>
            <button
              className="navbar-link"
              onClick={() => {
                localStorage.removeItem("userId");
                navigate("/");
              }}
            >
              <FiPower style={{ marginRight: "5px" }} /> Exit
            </button>
          </div>
        </nav>

        {/* Section Content */}
        <div style={{ marginTop: "80px" }}>{renderSection()}</div>
      </main>
    </div>
  );
}

export default Dashboard;
