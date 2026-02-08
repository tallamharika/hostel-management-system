 import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./Bookings.css";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [extendId, setExtendId] = useState(null);
  const [newCheckout, setNewCheckout] = useState("");
  const [viewBooking, setViewBooking] = useState(null);

  const userId = localStorage.getItem("userId");

  const loadBookings = async () => {
    try {
      const res = await axiosInstance.get(`/customer-bookings/${userId}`);
      setBookings(res.data);
    } catch (err) {
      console.error("❌ Booking fetch error:", err);
    }
  };

  useEffect(() => {
    if (userId) loadBookings();
  }, [userId]);

  const extendBooking = async () => {
    try {
      await axiosInstance.put(`/customer-bookings/extend/${extendId}`, {
        checkOutDate: newCheckout,
      });
      setExtendId(null);
      setNewCheckout("");
      loadBookings();
    } catch (err) {
      console.error("❌ Extend failed:", err);
    }
  };

  if (!bookings.length) {
    return <h3 style={{ textAlign: "center" }}>No bookings found</h3>;
  }

  return (
    <div className="customermain-content1">
      <div className="bookings-wrapper-vertical1">

        {bookings.map((b) => (
          <div key={b._id} className="booking-card-vertical1">
            <div className="booking-info1">
              <h3>{b.hostelName}</h3>

              <p><b>Room:</b> {b.roomNumber || "—"}</p>
              <p><b>Status:</b> {b.status}</p>

              <p>
                <b>Check-in:</b>{" "}
                {b.moveInDate
                  ? new Date(b.moveInDate).toDateString()
                  : "—"}
              </p>

              <p>
                <b>Check-out:</b>{" "}
                {b.checkOutDate
                  ? new Date(b.checkOutDate).toDateString()
                  : "—"}
              </p>

              <div className="booking-buttons-container1">
                <button
                  className="booking-btn1"
                  onClick={() => setViewBooking(b)}
                >
                  View Details
                </button>

                <button
                  className="booking-btn1"
                  onClick={() => setExtendId(b._id)}
                >
                  Extend Booking
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* 🔹 EXTEND MODAL */}
        {extendId && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Extend Booking</h3>

              <input
                type="date"
                value={newCheckout}
                onChange={(e) => setNewCheckout(e.target.value)}
              />

              <div style={{ marginTop: "15px" }}>
                <button className="booking-btn1" onClick={extendBooking}>
                  Update
                </button>
                <button
                  className="booking-btn1"
                  onClick={() => setExtendId(null)}
                  style={{ marginLeft: "10px", background: "#999" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 VIEW DETAILS MODAL */}
        {viewBooking && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Booking Details</h3>

              <p><b>Name:</b> {viewBooking.firstName} {viewBooking.lastName}</p>
              <p><b>Email:</b> {viewBooking.email}</p>
              <p><b>Phone:</b> {viewBooking.phone}</p>
              <p><b>College:</b> {viewBooking.college}</p>
              <p><b>Address:</b> {viewBooking.address}</p>
              <p><b>Aadhaar:</b> {viewBooking.aadhaar}</p>

              <p><b>Room:</b> {viewBooking.roomNumber}</p>
              <p><b>Status:</b> {viewBooking.status}</p>

              <p>
                <b>Check-in:</b>{" "}
                {viewBooking.moveInDate
                  ? new Date(viewBooking.moveInDate).toDateString()
                  : "—"}
              </p>

              <p>
                <b>Check-out:</b>{" "}
                {viewBooking.checkOutDate
                  ? new Date(viewBooking.checkOutDate).toDateString()
                  : "Not updated"}
              </p>

              <p><b>Monthly Rent:</b> ₹{viewBooking.monthlyRent}</p>
              <p><b>Security Deposit:</b> ₹{viewBooking.securityDeposit}</p>
              <p><b>Total Amount:</b> ₹{viewBooking.totalAmount}</p>

              <button
                className="booking-btn1"
                style={{ marginTop: "15px" }}
                onClick={() => setViewBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
