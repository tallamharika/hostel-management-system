import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import "../Dashboard.css";
import "./UpdateDeleteStudent.css"; // Reuse the same CSS

export default function UpdateDeleteEmployee() {
  const [formData, setFormData] = useState({
    mobile: "",
    name: "",
    fatherName: "",
    motherName: "",
    email: "",
    address: "",
    aadhaar: "",
    designation: "",
  });

  const [workingStatus, setWorkingStatus] = useState("working");
  const [isExistingEmployee, setIsExistingEmployee] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch employee by mobile
  const fetchEmployee = async () => {
    const trimmedMobile = formData.mobile.trim();
    if (!trimmedMobile) {
      setPopupMessage("Enter mobile number to fetch employee");
      setShowPopup(true);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/employees/find/${trimmedMobile}`
      );

      if (res.data.employee) {
        const emp = res.data.employee;
        setFormData({
          mobile: emp.mobile,
          name: emp.name,
          fatherName: emp.fatherName,
          motherName: emp.motherName,
          email: emp.email,
          address: emp.address,
          aadhaar: emp.aadhaar,
          designation: emp.designation,
        });
        setWorkingStatus(emp.workingStatus || "working");
        setIsExistingEmployee(true);
      } else {
        setPopupMessage("Employee not found");
        setShowPopup(true);
        setIsExistingEmployee(false);
      }
    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Error fetching employee");
      setShowPopup(true);
      setIsExistingEmployee(false);
    }
  };

  // Update employee by mobile
  const handleUpdate = async () => {
    if (!isExistingEmployee) {
      setPopupMessage("Fetch an employee first to update");
      setShowPopup(true);
      return;
    }

    try {
      const mobileToUpdate = formData.mobile.trim();
      // Fetch the _id first, then update by _id
      const empRes = await axios.get(
        `http://localhost:5000/api/employees/find/${mobileToUpdate}`
      );

      if (!empRes.data.employee) {
        setPopupMessage("Employee not found");
        setShowPopup(true);
        return;
      }

      const empId = empRes.data.employee._id;

      const res = await axios.put(
        `http://localhost:5000/api/employees/${empId}`,
        { ...formData, workingStatus }
      );

      setPopupMessage(res.data.message || "Employee updated successfully");
      setShowPopup(true);
      clearForm();
    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Error updating employee");
      setShowPopup(true);
    }
  };

  // Delete employee by mobile
  const handleDelete = async () => {
    if (!isExistingEmployee) {
      setPopupMessage("Fetch an employee first to delete");
      setShowPopup(true);
      return;
    }

    try {
      const mobileToDelete = formData.mobile.trim();
      const empRes = await axios.get(
        `http://localhost:5000/api/employees/find/${mobileToDelete}`
      );

      if (!empRes.data.employee) {
        setPopupMessage("Employee not found");
        setShowPopup(true);
        return;
      }

      const empId = empRes.data.employee._id;

      await axios.delete(`http://localhost:5000/api/employees/${empId}`);
      setPopupMessage("Employee deleted successfully");
      setShowPopup(true);
      clearForm();
    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Error deleting employee");
      setShowPopup(true);
    }
  };

  const clearForm = () => {
    setFormData({
      mobile: "",
      name: "",
      fatherName: "",
      motherName: "",
      email: "",
      address: "",
      aadhaar: "",
      designation: "",
    });
    setWorkingStatus("working");
    setIsExistingEmployee(false);
  };

  return (
    <div
      className="update-delete-page-background"
      style={{
        backgroundImage: 'url("/images/dashboard1-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "calc(100vh - 80px)",
        padding: "30px",
      }}
    >
      <div
        className="update-delete-content"
        style={{
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
          backgroundColor: "rgba(247, 224, 224, 0.85)",
          borderRadius: "7px",
          padding: "30px",
          boxSizing: "border-box",
        }}
      >
        {/* Mobile search */}
        <div className="update-delete-row search-row">
          <label>Mobile Number</label>
          <div className="search-container">
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
            <button onClick={fetchEmployee}>🔍</button>
          </div>
        </div>

        {/* Employee fields */}
        {["name","fatherName","motherName","email","address","aadhaar","designation"].map((field) => (
          <div className="update-delete-row" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Working Status */}
        <div className="update-delete-row">
          <label>Working Status</label>
          <select
            value={workingStatus}
            onChange={(e) => setWorkingStatus(e.target.value)}
          >
            <option value="working">Working</option>
            <option value="not-working">Not Working</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="update-delete-buttons">
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={clearForm}>Clear</button>
        </div>

        {/* Popup */}
        {showPopup && (
          <div className="modal-overlay">
            <div className="modal">
              <p>{popupMessage}</p>
              <button onClick={() => setShowPopup(false)}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
