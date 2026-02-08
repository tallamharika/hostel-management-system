import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";


export default function CustomerProfile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelationship: "",
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        setProfile({
          fullName: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
          address: user.address || "",
          emergencyName: user.emergencyName || "",
          emergencyPhone: user.emergencyPhone || "",
          emergencyRelationship: user.emergencyRelationship || "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load profile.");
      }
    };
    fetchProfile();
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/user/${userId}`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile saved successfully!");
      setProfile(res.data.user);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save profile.");
    }
  };

  const handleCancel = () => window.location.reload();

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <p className="subtitle">Manage your personal information</p>

      <div className="profile-avatar">
        <div className="avatar-circle">
          {profile.fullName
            ? profile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
            : "JD"}
        </div>
        <h2 className="profile-name">{profile.fullName}</h2>
        <p className="profile-custid">Customer ID: #{userId}</p>
        <button className="change-avatar">Change Avatar</button>
      </div>

      <div className="form-grid">
        <div>
          <label>Full Name</label>
          <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
        </div>
        <div>
          <label>Email Address</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} disabled />
        </div>
        <div>
          <label>Phone Number</label>
          <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
        </div>
        <div>
          <label>Date of Birth</label>
          <input type="date" name="dob" value={profile.dob} onChange={handleChange} />
        </div>
        <div className="full-span">
          <label>Address</label>
          <textarea name="address" value={profile.address} onChange={handleChange} rows="2"></textarea>
        </div>
      </div>

      <h3 className="emergency-title">Emergency Contact</h3>
      <div className="form-grid">
        <div>
          <label>Contact Name</label>
          <input type="text" name="emergencyName" value={profile.emergencyName} onChange={handleChange} />
        </div>
        <div>
          <label>Contact Phone</label>
          <input type="text" name="emergencyPhone" value={profile.emergencyPhone} onChange={handleChange} />
        </div>
        <div>
          <label>Relationship</label>
          <input type="text" name="emergencyRelationship" value={profile.emergencyRelationship} onChange={handleChange} />
        </div>
      </div>

      <div className="buttons-container">
        <button className="save-changes" onClick={handleSave}>Save Changes</button>
        <button className="cancel-changes" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
}
