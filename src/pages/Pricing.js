import React from "react";
import "./Pricing.css";
import { FaCheckCircle } from "react-icons/fa";

const Pricing = () => {
  return (
    <div className="pricing-page">
      <h1>Pricing Plans</h1>
      <p className="subtitle">Choose the plan that works best for your hostel</p>

      <div className="pricing-grid">
        {/* Basic Plan */}
        <div className="pricing-card">
          <h2>Basic Plan</h2>
          <p className="price">$49/month</p>
          <p className="tagline">Perfect for small hostels</p>
          <ul>
            <li><FaCheckCircle className="icon" /> Up to 50 students</li>
            <li><FaCheckCircle className="icon" /> Room management</li>
            <li><FaCheckCircle className="icon" /> Basic reporting</li>
            <li><FaCheckCircle className="icon" /> Email support</li>
          </ul>
          <button className="btn">Get Started</button>
        </div>

        {/* Professional Plan */}
        <div className="pricing-card highlight">
          <h2>Professional Plan</h2>
          <p className="price">$99/month</p>
          <p className="tagline">Ideal for medium hostels</p>
          <ul>
            <li><FaCheckCircle className="icon" /> Up to 200 students</li>
            <li><FaCheckCircle className="icon" /> All Basic features</li>
            <li><FaCheckCircle className="icon" /> Advanced analytics</li>
            <li><FaCheckCircle className="icon" /> Priority support</li>
            <li><FaCheckCircle className="icon" /> Maintenance module</li>
          </ul>
          <button className="btn">Get Started</button>
        </div>

        {/* Enterprise Plan */}
        <div className="pricing-card">
          <h2>Enterprise Plan</h2>
          <p className="price">$199/month</p>
          <p className="tagline">For large hostels & campuses</p>
          <ul>
            <li><FaCheckCircle className="icon" /> Unlimited students</li>
            <li><FaCheckCircle className="icon" /> All Professional features</li>
            <li><FaCheckCircle className="icon" /> Custom integrations</li>
            <li><FaCheckCircle className="icon" /> Dedicated account manager</li>
            <li><FaCheckCircle className="icon" /> White-label options</li>
          </ul>
          <button className="btn">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
