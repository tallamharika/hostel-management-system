import React from "react";
import "./About.css";
import { FaLightbulb, FaLock, FaClock, FaWifi, FaUsers, FaUtensils, FaCar, FaBed } from "react-icons/fa";

function About() {
  return (
    <div className="about-page">
      <h1>About Us</h1>

      {/* Features Section */}
      <div className="features-section">
        <h2>Why Choose SmartHostel?</h2>
        <div className="features-grid">
          <div className="about-card">
            <FaLightbulb className="icon" />
            <h3>Smart Room Controls</h3>
            <p>Control lighting, temperature, and appliances with our mobile app or voice commands.</p>
          </div>
          <div className="about-card">
            <FaLock className="icon" />
            <h3>Secure Access</h3>
            <p>Keyless entry with digital locks and secure authentication for maximum safety.</p>
          </div>
          <div className="about-card">
            <FaClock className="icon" />
            <h3>24/7 Self Check-in</h3>
            <p>Arrive anytime with our automated check-in system. No queues, no waiting.</p>
          </div>
          <div className="about-card">
            <FaWifi className="icon" />
            <h3>High-Speed Internet</h3>
            <p>Lightning-fast WiFi throughout the property for work, streaming, and gaming.</p>
          </div>
          <div className="about-card">
            <FaUsers className="icon" />
            <h3>Community Events</h3>
            <p>Join fun activities and meet new people through weekly hostel events.</p>
          </div>
          <div className="about-card">
            <FaUtensils className="icon" />
            <h3>Shared Kitchen</h3>
            <p>Cook your favorite meals anytime in our fully equipped kitchen.</p>
          </div>
          <div className="about-card">
            <FaCar className="icon" />
            <h3>Parking</h3>
            <p>Secure and convenient parking facilities for residents.</p>
          </div>
          <div className="about-card">
            <FaBed className="icon" />
            <h3>Comfortable Rooms</h3>
            <p>Modern rooms with cozy furniture designed for relaxation and productivity.</p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="about-section">
        <h2>Our Story</h2>
        <p>
          SmartHostel was founded in 2018 by a group of university administrators who 
          were frustrated with the outdated systems used to manage student hostels. 
          We set out to create a comprehensive, user-friendly solution that would streamline 
          operations and improve the experience for both administrators and students.
        </p>
        <p>
          Today, SmartHostel is used by over 500 educational institutions worldwide, helping 
          them manage more than 200,000 students efficiently.
        </p>
      </div>

      {/* Our Mission */}
      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          To transform hostel management through technology, making it easier for administrators 
          to provide excellent service to students while reducing operational costs and complexities.
        </p>
      </div>
    </div>
  );
}

export default About;
