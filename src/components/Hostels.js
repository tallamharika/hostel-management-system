import React, { useState, useEffect } from "react";
import "./Hostels.css";

export default function Hostels() {
  const [hostelData, setHostelData] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [roomType, setRoomType] = useState("All");
  const [roomCounts, setRoomCounts] = useState({});
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    email: "",
    phone: "",
    address: "",
    college: "",
    aadhaar: "",
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
  });

  // 🔹 Fetch all hostels for the list
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/hostels");
        const data = await res.json();
        setHostelData(data);
fetchRoomCounts(data); // ✅ ADD THIS LINE

      } catch (err) {
        console.error("Failed to load hostels", err);
      }
    };
    fetchHostels();
  }, []);
// 🔹 Fetch real available room counts per hostel
const fetchRoomCounts = async (hostels) => {
  const counts = {};

  for (let hostel of hostels) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/rooms/count/${hostel.createdBy}`
      );
      const data = await res.json();
      counts[hostel._id] = data.count;
    } catch (err) {
      console.error("Room count error", err);
      counts[hostel._id] = 0;
    }
  }

  setRoomCounts(counts);
};

  // 🔹 Open Booking and fetch available rooms for the selected hostel
  const openBooking = async (hostel) => {
    setSelectedHostel(hostel);
  setRoomType("All"); // 👈 ADD THIS LINE (RESET TYPE)

    try {
      // Using the route you defined in rooms.js: /by-hostel/:hostelName
      const res = await fetch(
  `http://localhost:5000/api/rooms/available/${hostel.createdBy}?type=All`
);

      const rooms = await res.json();

      if (rooms && rooms.length > 0) {
        setAvailableRooms(rooms);
        setShowBooking(true);
        // Set default room selection to the first available room
        setBookingDetails((prev) => ({ ...prev, roomNumber: rooms[0].number }));
      } else {
        alert("No rooms currently available for this hostel in the management system.");
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      alert("Error connecting to the room database.");
    }
  };

  const closeBooking = () => {
    setShowBooking(false);
    setSelectedHostel(null);
    setAvailableRooms([]);
  };

  const handleChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };
const handleRoomTypeChange = async (e) => {
  const selectedType = e.target.value;
  setRoomType(selectedType);

  try {
    const res = await fetch(
      `http://localhost:5000/api/rooms/available/${selectedHostel.createdBy}?type=${selectedType}`
    );
    const rooms = await res.json();

    setAvailableRooms(rooms);
    setBookingDetails((prev) => ({
      ...prev,
      roomNumber: rooms.length ? rooms[0].number : "",
    }));
  } catch (err) {
    console.error("Room filter error", err);
  }
};

  // ✅ Clean calculation for rent
 const monthlyRent = selectedHostel && selectedHostel.priceRange
  ? parseInt(selectedHostel.priceRange.match(/\d+/)[0])
  : 0;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
const [firstName, ...rest] = bookingDetails.name.trim().split(" ");
const lastName = rest.join(" ");

    const dataToSend = {
  hostelName: selectedHostel.name,

  // 👇 MANAGEMENT OWNER (for AllStudents)
  ownerId: selectedHostel.createdBy,

  // 👇 CUSTOMER ID
  userId: localStorage.getItem("userId"),

  // 👇 REQUIRED STUDENT DETAILS (VERY IMPORTANT)
  firstName,
  lastName,
  email: bookingDetails.email,
  phone: bookingDetails.phone,
  fatherName: bookingDetails.fatherName,
  motherName: bookingDetails.motherName,
  address: bookingDetails.address,
  college: bookingDetails.college,
  aadhaar: bookingDetails.aadhaar,
  roomNumber: bookingDetails.roomNumber,

  // 👇 CUSTOMER-ONLY (NOT MANAGEMENT)
  moveInDate: bookingDetails.checkInDate,
  checkOutDate: bookingDetails.checkOutDate,

  monthlyRent,
};


    try {
      const res = await fetch("http://localhost:5000/api/book-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Booking Successful!");
        closeBooking();
      } else {
        alert(result.message || "Booking failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Booking failed! Check server connection.");
    }
  };
const handlePayLater = async () => {
  const [firstName, ...rest] = bookingDetails.name.trim().split(" ");
  const lastName = rest.join(" ");

  const dataToSend = {
    hostelName: selectedHostel.name,
    ownerId: selectedHostel.createdBy,
    userId: localStorage.getItem("userId"),

    firstName,
    lastName,
    email: bookingDetails.email,
    phone: bookingDetails.phone,
    fatherName: bookingDetails.fatherName,
    motherName: bookingDetails.motherName,
    address: bookingDetails.address,
    college: bookingDetails.college,
    aadhaar: bookingDetails.aadhaar,
    roomNumber: bookingDetails.roomNumber,

    moveInDate: bookingDetails.checkInDate,
    checkOutDate: bookingDetails.checkOutDate,

    monthlyRent,

    // ⭐ KEY LINE
    paymentStatus: "Pending",
  };

  try {
    const res = await fetch("http://localhost:5000/api/book-now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Booking saved. You can pay later from Fee Tracking.");
      closeBooking();
    } else {
      alert(result.message || "Pay Later failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  return (
    <div className="hostels-wrapper-vertical1">
      {hostelData.map((hostel) => (
        <div key={hostel._id} className="hostel-card-vertical1">
          <img
            src={`http://localhost:5000/${hostel.image}`}
            alt={hostel.name}
            className="hostel-image1"
          />

          <div className="hostel-info1">
            <h3>{hostel.name}</h3>
            <p>Location: {hostel.location}</p>
            <p>
  Rooms Available: {roomCounts[hostel._id] ?? 0}
</p>
            <p>Price: {hostel.priceRange}</p>
            <button onClick={() => openBooking(hostel)}>Book Now</button>
          </div>
        </div>
      ))}

      {/* 🔹 Booking Popup */}
      {showBooking && selectedHostel && (
        <div className="booking-overlay">
          <div className="booking-form-card">
            <h2>Book {selectedHostel.name}</h2>
            <p>Complete your booking details</p>

            <form className="booking-form" onSubmit={handleBookingSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Student Full Name</label>
                  <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label>Father Name</label>
                  <input type="text" name="fatherName" onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label>Mother Name</label>
                  <input type="text" name="motherName" onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label>Email Address</label>
                  <input type="email" name="email" onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label>Mobile Number</label>
                  <input type="tel" name="phone" onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label>Aadhaar Number</label>
                  <input type="text" name="aadhaar" onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label>College Name</label>
                  <input type="text" name="college" onChange={handleChange} required />
                </div>

                <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                  <label>Address</label>
                  <input type="text" name="address" onChange={handleChange} required />
                </div>
<div className="form-field">
  <label>Room Type</label>
  <select
    value={roomType}
    onChange={handleRoomTypeChange}
    className="booking-select-dropdown"
  >
    <option value="All">All</option>
    <option value="Single">Single</option>
    <option value="Double">Double</option>
  </select>
</div>


                {/* ✅ DYNAMIC ROOM DROPDOWN */}
                <div className="form-field">
  <label>Select Room Number</label>
  <select
    name="roomNumber"
    value={bookingDetails.roomNumber}
    onChange={handleChange}
    className="booking-select-dropdown"
    required
  >
    {availableRooms.map((room) => (
      <option key={room._id} value={room.number}>
        Room {room.number} ({room.type})
      </option>
    ))}
  </select>
</div>

                <div className="form-field">
                  <label>Check-In Date</label>
                  <input type="date" name="checkInDate" onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label>Check-Out Date</label>
                  <input type="date" name="checkOutDate" onChange={handleChange} required />
                </div>
              </div>

              <div className="price-details">
                <p>Monthly Rent: ₹{monthlyRent}</p>
                <p>Security Deposit: ₹5000</p>
                <p>Total Amount: ₹{monthlyRent + 5000}</p>
              </div>

              <div className="form-actions">
                <button type="submit" className="confirm-btn">Confirm & Pay</button>
                <button type="button" className="cancel-btn" onClick={closeBooking}>Cancel</button>
                <button
    type="button"
    className="later-btn"
   onClick={handlePayLater}

  >
    Pay Later
  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
