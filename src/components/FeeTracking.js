// src/components/FeeTracking.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./FeeTracking.css";

export default function FeeTracking() {
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({
    totalPaid: 0,
    pending: 0,
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
  const fetchFees = async () => {
    try {
      if (!userId) return;

      const res = await axiosInstance.get(`/customer/fees/${userId}`);

      setFees(res.data.fees || []);
      setSummary({
        totalPaid: res.data.totalPaid || 0,
        pending: res.data.pending || 0,
      });
    } catch (err) {
      console.error("❌ Fee fetch error:", err);
    }
  };

  fetchFees();
}, [userId]);
  const handleReceipt = (payment) => {
    alert(
      `🧾 RECEIPT\n\nMonth: ${payment.month}\nType: ${payment.type}\nAmount: ₹${payment.amount}\nStatus: ${payment.status}\nPaid Date: ${
        payment.paidDate || "-"
      }`
    );
  };
const handlePay = async (payment) => {
  try {
    await axiosInstance.post(
      `/customer/fees/pay/${payment._id}`
    );

    alert("✅ Payment successful");

    // reload fees after payment
  } catch (err) {
    alert("❌ Payment failed");
    console.error(err);
  }
};

  return (
    <div className="feetracking-wrapper">
      <div className="feetracking-header">
        <h2>Fee Tracking</h2>
        <p>Track your hostel payments & dues</p>
      </div>

      <div className="feetracking-summary">
        <div className="summary-card paid">
          <h3>Total Paid</h3>
          <p>₹{summary.totalPaid}</p>
        </div>

        <div className="summary-card pending">
          <h3>Pending</h3>
          <p>₹{summary.pending}</p>
        </div>

        <div className="summary-card report">
          <h3>Reports</h3>
          <button onClick={() => alert("📄 Report Downloaded")}>
            Download
          </button>
        </div>
      </div>

      <div className="feetracking-history">
        {fees.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No payment records found
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Paid Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {fees.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.month}</td>
                  <td>{payment.type}</td>
                  <td>₹{payment.amount}</td>
                  <td>{payment.paidDate || "-"}</td>
                  <td>
                    <span
                      className={`status ${
                        payment.status === "Paid" ? "paid" : "pending"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td>
  {payment.status === "Paid" ? (
    <button
      className="receipt-btn"
      onClick={() => handleReceipt(payment)}
    >
      Receipt
    </button>
  ) : (
    <button
      className="pay-btn"
      onClick={() => handlePay(payment)}
    >
      Pay
    </button>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
