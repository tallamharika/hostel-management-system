// src/pages/sections/NewEmployee.js
import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import "./NewEmployee.css";

export default function NewEmployee() {
  const [form, setForm] = useState({
    mobile: "",
    name: "",
    fatherName: "",
    motherName: "",
    email: "",
    address: "",
    aadhaar: "",
    designation: "",
  });

  const [popup, setPopup] = useState(""); // popup message
  const [showPopup, setShowPopup] = useState(false); // popup visibility

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/employees",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      setPopup(res.data.message || "Employee saved successfully!");
      setShowPopup(true);

      // Reset form
      setForm({
        mobile: "",
        name: "",
        fatherName: "",
        motherName: "",
        email: "",
        address: "",
        aadhaar: "",
        designation: "",
      });

      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error("Error saving employee:", err);
      setPopup(
        err.response?.data?.message || err.message || "Server error. Try again."
      );
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  const handleClear = () => {
    setForm({
      mobile: "",
      name: "",
      fatherName: "",
      motherName: "",
      email: "",
      address: "",
      aadhaar: "",
      designation: "",
    });
  };

  return (
    <div
      className="new-employee-page-background"
      style={{
        backgroundImage: 'url("/images/dashboard1-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "70vh",
        padding: "200px",
        position: "relative",
      }}
    >
      {/* Popup at the top */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#28a745",
            color: "white",
            padding: "15px 30px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 9999,
          }}
        >
          {popup}
        </div>
      )}

      <div className="new-employee-content">
        <div className="new-employee-content-row">
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Enter Mobile Number"
          />
        </div>

        <div className="new-employee-content-row">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter Name"
          />
        </div>

        <div className="new-employee-content-row">
          <label>Father Name</label>
          <input
            type="text"
            name="fatherName"
            value={form.fatherName}
            onChange={handleChange}
            placeholder="Enter Father Name"
          />
        </div>

        <div className="new-employee-content-row">
          <label>Mother Name</label>
          <input
            type="text"
            name="motherName"
            value={form.motherName}
            onChange={handleChange}
            placeholder="Enter Mother Name"
          />
        </div>

        <div className="new-employee-content-row">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter Email"
          />
        </div>

        <div className="new-employee-content-row">
          <label>Permanent Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter Permanent Address"
          />
        </div>

        <div className="new-employee-content-row">
          <label>Aadhaar Number (UNIQUE ID)</label>
          <input
            type="text"
            name="aadhaar"
            value={form.aadhaar}
            onChange={handleChange}
            placeholder="Enter Aadhaar Number"
          />
        </div>

        <div className="new-employee-content-row">
          <label>Designation</label>
          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
          >
            <option value="">Select Designation</option>
            <option value="warden">Warden</option>
            <option value="cook">Cook</option>
            <option value="watchman">Watchman</option>
            <option value="cleaner">Cleaner</option>
          </select>
        </div>

        <div className="new-employee-content-buttons">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="clear-button" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
