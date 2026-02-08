import React, { useState } from "react";
import "../Dashboard.css";
import "./UpdateDeleteStudent.css";
import axiosInstance from "../../utils/axiosInstance";

export default function UpdateDeleteStudent() {
  const [formData, setFormData] = useState({
    mobile: "",
    name: "",
    fatherName: "",
    motherName: "",
    email: "",
    address: "",
    college: "",
    aadhaar: "",
    roomNumber: "",
  });

  const [livingStatus, setLivingStatus] = useState("Living");
  const [isExistingStudent, setIsExistingStudent] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔍 FETCH STUDENT
  const fetchStudent = async () => {
    const mobile = formData.mobile.trim();
    if (!mobile) {
      setPopupMessage("Enter mobile number to fetch student");
      setShowPopup(true);
      return;
    }

    try {
      const res = await axiosInstance.get(
        `/students/find/${mobile}`
      );

      const student = res.data.student;

      setFormData({
        mobile: student.mobile,
        name: student.name,
        fatherName: student.fatherName,
        motherName: student.motherName,
        email: student.email,
        address: student.address,
        college: student.college,
        aadhaar: student.aadhaar,
        roomNumber: student.roomNumber,
      });

      setLivingStatus(student.livingStatus || "Living");
      setIsExistingStudent(true);
    } catch (err) {
      setPopupMessage(
        err.response?.data?.message || "Student not found"
      );
      setShowPopup(true);
      setIsExistingStudent(false);
    }
  };

  // ✏️ UPDATE STUDENT
  const handleUpdate = async () => {
    if (!isExistingStudent) {
      setPopupMessage("Fetch a student first to update");
      setShowPopup(true);
      return;
    }

    try {
      const res = await axiosInstance.put(
        `/students/${formData.mobile}`,
        {
          ...formData,
          livingStatus,
        }
      );

      setPopupMessage(res.data.message || "Student updated");
      setShowPopup(true);
      clearForm();
    } catch (err) {
      setPopupMessage(
        err.response?.data?.message || "Error updating student"
      );
      setShowPopup(true);
    }
  };

  // 🗑️ DELETE STUDENT
  const handleDelete = async () => {
    if (!isExistingStudent) {
      setPopupMessage("Fetch a student first to delete");
      setShowPopup(true);
      return;
    }

    try {
      const res = await axiosInstance.delete(
        `/students/${formData.mobile}`
      );

      setPopupMessage(res.data.message || "Student deleted");
      setShowPopup(true);
      clearForm();
    } catch (err) {
      setPopupMessage(
        err.response?.data?.message || "Error deleting student"
      );
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
      college: "",
      aadhaar: "",
      roomNumber: "",
    });
    setLivingStatus("Living");
    setIsExistingStudent(false);
  };

  return (
    <div className="update-delete-page-background">
      <div className="update-delete-content">
        <div className="update-delete-row">
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
          <button onClick={fetchStudent}>Search</button>
        </div>

        {[
          "name",
          "fatherName",
          "motherName",
          "email",
          "address",
          "college",
          "aadhaar",
        ].map((field) => (
          <div key={field} className="update-delete-row">
            <label>{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="update-delete-row">
          <label>Room Number</label>
          <input type="text" value={formData.roomNumber} readOnly />
        </div>

        <div className="update-delete-row">
          <label>Living Status</label>
          <select
            value={livingStatus}
            onChange={(e) => setLivingStatus(e.target.value)}
          >
            <option value="Living">Living</option>
            <option value="Leaved">Leaved</option>
          </select>
        </div>

        <div className="update-delete-buttons">
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={clearForm}>Clear</button>
        </div>

        {showPopup && (
          <div className="modal-overlay">
            <div className="modal">
              <p>{popupMessage}</p>
              <button onClick={() => setShowPopup(false)}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
