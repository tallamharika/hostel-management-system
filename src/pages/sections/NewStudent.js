import React, { useEffect, useState } from "react";
import "../Dashboard.css";
import "./NewStudent.css";
import axiosInstance from "../../utils/axiosInstance";

export default function NewStudent() {
  const [roomType, setRoomType] = useState("All");
const [rooms, setRooms] = useState([]);
const [selectedRoom, setSelectedRoom] = useState("");
  const [formData, setFormData] = useState({
    mobile: "",
    name: "",
    fatherName: "",
    motherName: "",
    email: "",
    address: "",
    college: "",
    aadhaar: "",
  });
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  // 🔹 Fetch available rooms
  const fetchAvailableRooms = async () => {
  try {
    const res = await axiosInstance.get("/rooms/available", {
  params: { type: roomType },
});


    const roomsData = res.data;   // ✅ correct source

    setRooms(roomsData);

    if (roomsData.length > 0) {
      setSelectedRoom(roomsData[0].number);
      setFormVisible(true);
    } else {
      setSelectedRoom("");
      setFormVisible(false);
    }
  } catch (err) {
    console.error("Room fetch error:", err);
  }
};


  useEffect(() => {
  fetchAvailableRooms();
}, [roomType]);


  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Save student
  const handleSave = async () => {
    if (!selectedRoom) {
      setPopupMessage("Select a room");
      setShowPopup(true);
      return;
    }

    try {
      const res = await axiosInstance.post("/students", {
        ...formData,
        roomNumber: selectedRoom,
      });

      setPopupMessage(res.data.message || "Student added successfully");
      setShowPopup(true);

      // clear form
      setFormData({
        mobile: "",
        name: "",
        fatherName: "",
        motherName: "",
        email: "",
        address: "",
        college: "",
        aadhaar: "",
      });

      await fetchAvailableRooms();
    } catch (err) {
      setPopupMessage(
        err.response?.data?.message || "Error saving student"
      );
      setShowPopup(true);
    }
  };

  return (
    <div
      className="new-student-page-background"
      style={{
        backgroundImage: 'url("/images/dashboard1-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "70vh",
        padding: "200px",
      }}
    >
      <div className="new-student-content">
        {formVisible && (
          <>
            <h2>NEW STUDENT</h2>

            {[
              { label: "Mobile Number", name: "mobile", type: "text" },
              { label: "Name", name: "name", type: "text" },
              { label: "Father Name", name: "fatherName", type: "text" },
              { label: "Mother Name", name: "motherName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Permanent Address", name: "address", type: "text" },
              { label: "College Name", name: "college", type: "text" },
              { label: "Aadhaar Number (UNIQUE ID)", name: "aadhaar", type: "text" },
            ].map((field) => (
              <div className="new-student-content-row" key={field.name}>
                <label className="new-student-content-label">{field.label}</label>
                <input
                  type={field.type}
                  className="new-student-content-input"
                  placeholder={`Enter ${field.label}`}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              </div>
            ))}
<div className="new-student-content-row">
  <label className="new-student-content-label">Room Type</label>
  <select
    className="new-student-content-input"
    value={roomType}
    onChange={(e) => setRoomType(e.target.value)}
  >
    <option value="All">All</option>
    <option value="Single">Single</option>
    <option value="Double">Double</option>
  </select>
</div>

            <div className="new-student-content-row">
              <label className="new-student-content-label">Room Number</label>
              <select
                className="new-student-content-input"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                {rooms.map((room) => (
                  <option key={room._id} value={room.number}>
                    {room.number} ({room.type})

                  </option>
                ))}
                {rooms.length === 0 && <option>No available rooms</option>}
              </select>
            </div>

            <div className="new-student-content-buttons">
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
              <button
                className="clear-button"
                onClick={() =>
                  setFormData({
                    mobile: "",
                    name: "",
                    fatherName: "",
                    motherName: "",
                    email: "",
                    address: "",
                    college: "",
                    aadhaar: "",
                  })
                }
              >
                Clear
              </button>
            </div>
          </>
        )}

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


