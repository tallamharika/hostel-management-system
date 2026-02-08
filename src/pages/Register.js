import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ setIsLoggedIn }) {
  const [activeTab, setActiveTab] = useState("customer");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    hostelName: "",
    location: "",
    roomsAvailable: "",
    roomDetails: "",
    file: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const role = activeTab === "hostel" ? "management" : "customer";

    let payload;
    let headers = {};

    if (activeTab === "hostel") {
      payload = new FormData();
      payload.append("email", formData.email);
      payload.append("name", formData.fullName || formData.hostelName);
      payload.append("location", formData.location);
      payload.append("roomsAvailable", formData.roomsAvailable);
      payload.append("roomDetails", formData.roomDetails);
      payload.append("password", formData.password);
      payload.append("role", role);
      if (formData.file) payload.append("file", formData.file);
    } else {
      payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role
      };
      headers["Content-Type"] = "application/json";
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: activeTab === "hostel" ? payload : JSON.stringify(payload),
        headers
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "Invalid server response" };
      }

      if (res.ok) {
        alert(data.message || "Registration successful!");

        // ✅ Save role & token in localStorage
        // ✅ Redirect after registration
        if (role === "management") {
          navigate("/login");
        } else {
          navigate("/login");
        }
      } else {
        alert(data.message || "Registration failed!");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert(err.message || "Failed to connect to backend!");
    }
  };

  // Optional test backend
  const testBackend = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/test");
      const text = await res.text();
      alert(text);
    } catch (err) {
      alert("Failed to connect to backend!");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8 flex">
        {/* Left Tabs */}
        <div className="flex flex-col space-y-4 w-1/4">
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "customer"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("customer")}
          >
            Customer
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "hostel"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("hostel")}
          >
            Hostel Management
          </button>
        </div>

        {/* Right Form */}
        <div className="flex-1 ml-6">
          
          {activeTab === "customer" && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Customer Register</h2>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
              >
                Register
              </button>
            </form>
          )}

          {activeTab === "hostel" && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Hostel Management Register</h2>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                name="hostelName"
                placeholder="Hostel Name"
                value={formData.hostelName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="number"
                name="roomsAvailable"
                placeholder="Rooms Available"
                value={formData.roomsAvailable}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <textarea
                name="roomDetails"
                placeholder="Room Types & Costs"
                value={formData.roomDetails}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
