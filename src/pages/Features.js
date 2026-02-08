import React from "react";
import "./Features.css";  // make sure file exists
import { FaBed, FaUserGraduate, FaCreditCard, FaTools, FaBoxes, FaChartBar } from "react-icons/fa";

const Features = () => {
  return (
    <div className="features-page">
      <h1>Detailed Features</h1>
      <p className="subtitle">
        Explore all the powerful features of our hostel management system
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <FaBed className="icon" />
          <h3>Room Management</h3>
          <p>
            Easily manage room allocations, vacancies, and transfers. Track
            occupancy rates and optimize utilization.
          </p>
        </div>

        <div className="feature-card">
          <FaUserGraduate className="icon" />
          <h3>Student Portal</h3>
          <p>
            Provide students a portal to submit requests, pay fees, and
            communicate with hostel administration.
          </p>
        </div>

        <div className="feature-card">
          <FaCreditCard className="icon" />
          <h3>Billing & Payments</h3>
          <p>
            Automate fee collection, generate invoices, and support multiple
            payment methods.
          </p>
        </div>

        <div className="feature-card">
          <FaTools className="icon" />
          <h3>Maintenance Requests</h3>
          <p>
            Streamline maintenance with ticket creation, assignment, and tracking
            until resolution.
          </p>
        </div>

        <div className="feature-card">
          <FaBoxes className="icon" />
          <h3>Inventory Management</h3>
          <p>
            Track hostel assets, supplies, and equipment with ease.
          </p>
        </div>

        <div className="feature-card">
          <FaChartBar className="icon" />
          <h3>Analytics & Reports</h3>
          <p>
            Gain insights with reports on occupancy, revenue, expenses, and other
            key indicators.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
