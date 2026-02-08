// src/pages/sections/LeavedEmployee.js
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import "./LeavedEmployee.css";

export default function LeavedEmployee() {
  const [employees, setEmployees] = useState([]);
  const [popup, setPopup] = useState("");

  // ✅ Fetch leaved employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees/leaved/all");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching leaved employees:", err);
      setPopup("Error fetching leaved employees");
      setTimeout(() => setPopup(""), 3000);
    }
  };

  return (
    <div
      className="leaved-employee-page-background"
      style={{
        backgroundImage: 'url("/images/dashboard1-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "70vh",
        padding: "200px",
      }}
    >
      <div className="leaved-employee-content">
        {popup && <div className="popup">{popup}</div>}

        {/* Table header */}
        <div className="leaved-employee-row header">
          <div>Name</div>
          <div>Mobile</div>
          <div>Aadhaar</div>
          <div>Address</div>
          <div>Designation</div>
        </div>

        {/* Employee rows */}
        {employees.length === 0 ? (
          <div className="leaved-employee-row">
            <div className="leaved-employee-cell" colSpan="5">
              No leaved employees
            </div>
          </div>
        ) : (
          employees.map((e) => (
            <div key={e._id} className="leaved-employee-row">
              <div>{e.name}</div>
              <div>{e.mobile}</div>
              <div>{e.aadhaar}</div>
              <div>{e.address}</div>
              <div>{e.designation}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
