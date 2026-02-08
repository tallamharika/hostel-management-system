import React from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaList,
  FaDollarSign,
  FaInfoCircle,
  FaAddressBook,
} from "react-icons/fa";
import "./Contact.css";

function Contact() {
  return (
    <div className="page-content contact-page">
      <h1>Contact Us</h1>
      <p className="subtitle">Get in touch with our team</p>

      {/* Info Section */}
      <div className="contact-info">
        <div className="info-item">
          <FaMapMarkerAlt className="icon" />
          <div>
            <h3>Address</h3>
            <p>123 Tech Street, Innovation City, IC 10101</p>
          </div>
        </div>
        <div className="info-item">
          <FaPhone className="icon" />
          <div>
            <h3>Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="info-item">
          <FaEnvelope className="icon" />
          <div>
            <h3>Email</h3>
            <p>info@smarthostel.com</p>
          </div>
        </div>
      </div>

      {/* Message Form */}
      <div className="contact-form">
        <h2>Send us a message</h2>
        <form>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Email Address" required />
          <input type="text" placeholder="Subject" required />
          <textarea placeholder="Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-about">
          <h3>SmartHostel</h3>
          <p>
            Modern hostel management solutions for educational institutions and
            private hostels.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><FaHome /> Home</li>
            <li><FaList /> Features</li>
            <li><FaDollarSign /> Pricing</li>
            <li><FaInfoCircle /> About Us</li>
            <li><FaAddressBook /> Contact</li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p><FaMapMarkerAlt /> 123 Tech Street, Innovation City</p>
          <p><FaPhone /> +1 (555) 123-4567</p>
          <p><FaEnvelope /> info@smarthostel.com</p>
        </div>
      </footer>

      <div className="footer-bottom">
        © 2023 SmartHostel. All rights reserved.
      </div>
    </div>
  );
}

export default Contact;
