// src/pages/sections/AllEmployeeWorking.js
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import "./AllEmployeeWorking.css";

export default function AllEmployeeWorking() {
  const [employees, setEmployees] = useState([]);

  // ✅ Fetch working employees from backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      // Filter only working employees
      const workingEmployees = res.data.filter(emp => emp.workingStatus === "working");
      setEmployees(workingEmployees);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  return (
    <div
      className="all-employee-working-page-background"
      style={{
        backgroundImage: 'url("/images/dashboard1-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "70vh",
        padding: "200px",
      }}
    >
      <div className="all-employee-working-content">
        {/* Table header */}
        <div className="all-employee-working-row header">
          <div className="all-employee-working-cell">Name</div>
          <div className="all-employee-working-cell">Mobile Number</div>
          <div className="all-employee-working-cell">Aadhaar</div>
          <div className="all-employee-working-cell">Address</div>
          <div className="all-employee-working-cell">Designation</div>
        </div>

        {/* Employee data */}
        {employees.length === 0 ? (
          <div className="all-employee-working-row">
            <div className="all-employee-working-cell" colSpan="5">
              No employees working
            </div>
          </div>
        ) : (
          employees.map(emp => (
            <div key={emp._id} className="all-employee-working-row">
              <div className="all-employee-working-cell">{emp.name}</div>
              <div className="all-employee-working-cell">{emp.mobile}</div>
              <div className="all-employee-working-cell">{emp.aadhaar}</div>
              <div className="all-employee-working-cell">{emp.address}</div>
              <div className="all-employee-working-cell">{emp.designation}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
