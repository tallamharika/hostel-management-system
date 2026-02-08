// src/pages/CustomerHostels.js
import React from "react";

const hostels = [
  { name: "Sunrise Hostel", location: "City Center", rooms: 20, price: "₹5000 - ₹8000" },
  { name: "Moonlight Hostel", location: "Near River", rooms: 15, price: "₹4500 - ₹7500" },
  { name: "Starview Hostel", location: "Uptown", rooms: 25, price: "₹5500 - ₹9000" },
];

function CustomerHostels() {
  return (
    <div className="hostels-grid" style={{ padding: "20px" }}>
      {hostels.map((hostel, idx) => (
        <div key={idx} className="hostel-card">
          <h3>{hostel.name}</h3>
          <p>Location: {hostel.location}</p>
          <p>Rooms Available: {hostel.rooms}</p>
          <p>Price: {hostel.price}</p>
          <button onClick={() => alert(`Booking ${hostel.name}`)}>Book Now</button>
        </div>
      ))}
    </div>
  );
}

export default CustomerHostels;
