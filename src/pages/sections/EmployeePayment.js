import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import "./EmployeePayment.css";

export default function EmployeePayment() {
  const [mobileSearch, setMobileSearch] = useState("");
  const [employee, setEmployee] = useState({ name: "", email: "", designation: "", _id: "" });
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [amount, setAmount] = useState(5000);
  const [paymentMade, setPaymentMade] = useState(false);
  const [popup, setPopup] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const showMessage = (msg) => {
    setPopup(msg);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const fetchPaymentHistory = async (employeeId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/payments?employeeId=${employeeId}`);
      setPaymentHistory(res.data.payments || []);
    } catch (err) {
      console.error(err);
      setPaymentHistory([]);
    }
  };

  const handleSearch = async () => {
    const trimmedMobile = mobileSearch.trim();
    if (!trimmedMobile) {
      showMessage("Enter mobile number");
      return;
    }

    setPaymentHistory([]);

    try {
      const res = await axios.get(`http://localhost:5000/api/employees/find/${trimmedMobile}`);
      if (!res.data.employee) {
        showMessage("Employee not found");
        setEmployee({ name: "", email: "", designation: "", _id: "" });
        setPaymentMade(false);
        setAmount(5000);
        return;
      }

      const foundEmployee = res.data.employee;
      setEmployee(foundEmployee);

      fetchPaymentHistory(foundEmployee._id);

      // Check payment for the month
      const paymentRes = await axios.get(
        `http://localhost:5000/api/payments/${foundEmployee._id}/${date}`
      );

      if (paymentRes.data.exists) {
        setPaymentMade(true);
        setAmount(paymentRes.data.amount || 5000);
        showMessage("Payment already made for this month");
      } else {
        setPaymentMade(false);
        setAmount(5000);
      }
    } catch (err) {
      console.error(err);
      showMessage("Error fetching employee or payment data");
      setEmployee({ name: "", email: "", designation: "", _id: "" });
      setPaymentMade(false);
      setAmount(5000);
    }
  };

  const handleSave = async () => {
    if (!employee._id || !date || !amount) {
      showMessage("Please fill all required fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/payments", {
        employeeId: employee._id,
        date,
        amount,
      });
      setPaymentMade(true);
      showMessage(res.data.message || "Payment saved successfully");
      fetchPaymentHistory(employee._id);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error saving payment";
      showMessage(msg);
    }
  };

  const handleClear = () => {
    setMobileSearch("");
    setEmployee({ name: "", email: "", designation: "", _id: "" });
    setDate(new Date().toISOString().slice(0, 7));
    setAmount(5000);
    setPaymentMade(false);
    setShowPopup(false);
    setPaymentHistory([]);
  };

  const PaymentTable = () => (
    <div className="payment-history-container" style={{ marginTop: '40px', color: 'black' }}>
      <h3 style={{ borderBottom: '2px solid #ccc', paddingBottom: '5px' }}>Payment History</h3>
      {paymentHistory.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ccc' }}>
          {employee._id ? "No payment history found for this employee." : "Search for an employee to view payment history."}
        </p>
      ) : (
        <table className="employee-payment-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Month</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment._id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{payment.date}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{payment.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div
      className="employee-payment-page-background"
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
      <div className="employee-payment-content" style={{ position: "relative" }}>
        {showPopup && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#28a745",
              color: "white",
              padding: "15px 30px",
              borderRadius: "5px",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              zIndex: 9999,
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            {popup}
          </div>
        )}

        <div style={{ position: "relative" }}>
          <div className="employee-payment-row search-row">
            <label className="employee-payment-label">Mobile Number</label>
            <div className="search-container">
              <input
                type="text"
                className="employee-payment-input"
                placeholder="Search mobile number"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
              />
              <button className="search-button" onClick={handleSearch}>🔍</button>
            </div>
          </div>

          <div className="employee-payment-row">
            <label className="employee-payment-label">Name</label>
            <input type="text" className="employee-payment-input" value={employee.name} readOnly />
          </div>
          <div className="employee-payment-row">
            <label className="employee-payment-label">Email</label>
            <input type="email" className="employee-payment-input" value={employee.email} readOnly />
          </div>
          <div className="employee-payment-row">
            <label className="employee-payment-label">Designation</label>
            <input type="text" className="employee-payment-input" value={employee.designation} readOnly />
          </div>
          <div className="employee-payment-row">
            <label className="employee-payment-label">Month</label>
            <input
              type="month"
              className="employee-payment-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="employee-payment-row">
            <label className="employee-payment-label">Payment Amount</label>
            <input
              type="number"
              className="employee-payment-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="employee-payment-buttons">
            {!paymentMade && <button className="save-button" onClick={handleSave}>Save</button>}
            <button className="clear-button" onClick={handleClear}>Clear</button>
          </div>
        </div>

        {employee._id && <PaymentTable />}
      </div>
    </div>
  );
}
