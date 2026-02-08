// src/pages/sections/StudentFees.js
import React, { useState, useEffect } from "react";
import "../Dashboard.css";
import "./StudentFees.css";
import axiosInstance from "../../utils/axiosInstance";

export default function StudentFees() {
  const [formData, setFormData] = useState({
    mobile: "",
    name: "",
    roomNumber: "",
    month: new Date().toISOString().slice(0, 7),
    amount: 6000,
  });

  const [feesHistory, setFeesHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [saveDisabled, setSaveDisabled] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto-hide popup
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // 🔍 Fetch student + fees
  const fetchStudent = async () => {
    const trimmedMobile = formData.mobile.trim();
    if (!trimmedMobile) {
      setPopupMessage("Enter mobile number to fetch student");
      setShowPopup(true);
      return;
    }

    try {
      setFeesHistory([]);
      setSaveDisabled(false);

      // ✅ fetch student
      const res = await axiosInstance.get(
        `/students/find/${trimmedMobile}`
      );

      const student = res.data.student;
      const currentMonth = new Date().toISOString().slice(0, 7);

      // ✅ check current month fee
      const feeRes = await axiosInstance.get("/fees", {
        params: { mobile: trimmedMobile, month: currentMonth },
      });

      const feeAlreadyPaid =
        feeRes.data.fees && feeRes.data.fees.length > 0;

      setSaveDisabled(feeAlreadyPaid);

      if (feeAlreadyPaid) {
        setPopupMessage(
          `Fees already paid for ${currentMonth}`
        );
        setShowPopup(true);
      }

      // fill form
      setFormData({
        mobile: student.mobile,
        name: student.name,
        roomNumber: student.roomNumber,
        month: currentMonth,
        amount: 6000,
      });

      // ✅ fetch full history
      const historyRes = await axiosInstance.get("/fees", {
        params: { mobile: trimmedMobile },
      });

      setFeesHistory(historyRes.data.fees || []);
    } catch (err) {
      console.error(err);
      setPopupMessage(
        err.response?.status === 404
          ? "Student not found"
          : err.response?.data?.message || "Error fetching student"
      );
      setShowPopup(true);
      handleClear();
    }
  };

  // 💾 Save fee
  const handleSave = async () => {
    try {
      await axiosInstance.post("/fees", formData);
      setPopupMessage("Fees saved successfully");
      setShowPopup(true);
      setSaveDisabled(true);

      setFeesHistory((prev) => [
        ...prev,
        { month: formData.month, amount: formData.amount },
      ]);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Error saving fee";
      setPopupMessage(msg);
      setShowPopup(true);
      if (msg.includes("already")) setSaveDisabled(true);
    }
  };

  const handleClear = () => {
    setFormData({
      mobile: "",
      name: "",
      roomNumber: "",
      month: new Date().toISOString().slice(0, 7),
      amount: 6000,
    });
    setFeesHistory([]);
    setSaveDisabled(false);
  };

  return (
    <div className="student-fees-page-background">
      <div className="student-fees-content">
        {/* Mobile */}
        <div className="student-fees-row">
          <label>Mobile Number</label>
          <div className="search-container">
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter Mobile Number"
            />
            <button onClick={fetchStudent}>🔍</button>
          </div>
        </div>

        <div className="student-fees-row">
          <label>Name</label>
          <input value={formData.name} readOnly />
        </div>

        <div className="student-fees-row">
          <label>Room Number</label>
          <input value={formData.roomNumber} readOnly />
        </div>

        <div className="student-fees-row">
          <label>Month</label>
          <input
            type="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
          />
        </div>

        <div className="student-fees-row">
          <label>Amount</label>
          <input value={formData.amount} readOnly />
        </div>

        {feesHistory.length > 0 && (
          <table className="fees-history-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {feesHistory.map((f, i) => (
                <tr key={i}>
                  <td>{f.month}</td>
                  <td>{f.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="student-fees-buttons">
          {!saveDisabled && (
            <button onClick={handleSave}>Save</button>
          )}
          <button onClick={handleClear}>Clear</button>
        </div>

        {showPopup && (
          <div className="modal-overlay">
            <div className="modal">
              <p>{popupMessage}</p>
              <button
  onClick={() => {
    setShowPopup(false);
    setFeesHistory((prev) => [...prev]);
  }}
>
  OK
</button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  