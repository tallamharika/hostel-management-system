import React, { useEffect, useState } from "react";
import "../Dashboard.css";
import "./ManageRooms.css";
import axiosInstance from "../../utils/axiosInstance";

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [number, setNumber] = useState("");
  const [active, setActive] = useState(false);
  const [searchNumber, setSearchNumber] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [foundRoom, setFoundRoom] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [roomType, setRoomType] = useState("Single");

  // Fetch all rooms
  const fetchRooms = async () => {
    try {
      const res = await axiosInstance.get("/rooms/admin");

      setRooms(res.data);
    } catch (err) {
      setPopupMessage("Error fetching rooms");
      setShowPopup(true);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ✅ ADD ROOM (FIXED)
  const handleAddRoom = async () => {
    if (!number) {
      setPopupMessage("Enter room number");
      setShowPopup(true);
      return;
    }
    try {
      const res = await axiosInstance.post("/rooms", {
  number,
  active,
  type: roomType,
});

      setPopupMessage(res.data.message || "Room added successfully");
      setShowPopup(true);
      setNumber("");
      setActive(false);
      fetchRooms();
    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Error adding room");
      setShowPopup(true);
    }
  };

  // Search room
  const handleSearch = () => {
    const room = rooms.find((r) => r.number === searchNumber);
    if (room) {
      setFoundRoom(room);
      setSearchActive(room.active);
    } else {
      setPopupMessage("Room not found");
      setShowPopup(true);
      setFoundRoom(null);
      setSearchActive(false);
    }
  };

  // ✅ UPDATE ROOM (FIXED)
  const handleUpdate = async () => {
    if (!searchNumber) {
      setPopupMessage("Enter room number to update");
      setShowPopup(true);
      return;
    }
    try {
      const res = await axiosInstance.put(
        `/rooms/${searchNumber}`,
        { active: searchActive }
      );
      setPopupMessage(res.data.message || "Room updated successfully");
      setShowPopup(true);
      setSearchNumber("");
      setFoundRoom(null);
      setSearchActive(false);
      fetchRooms();
    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Error updating room");
      setShowPopup(true);
    }
  };

  // ✅ DELETE ROOM (FIXED)
  const handleDelete = async () => {
    if (!searchNumber) {
      setPopupMessage("Enter room number to delete");
      setShowPopup(true);
      return;
    }
    try {
      const res = await axiosInstance.delete(`/rooms/${searchNumber}`);
      setPopupMessage(res.data.message || "Room deleted successfully");
      setShowPopup(true);
      setSearchNumber("");
      setFoundRoom(null);
      setSearchActive(false);
      fetchRooms();
    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Error deleting room");
      setShowPopup(true);
    }
  };

  return (
    <div
      className="manage-rooms-page"
      style={{
        backgroundImage: 'url("/images/dashboard1-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "80vh",
        padding: "20px",
        position: "relative",
      }}
    >
      <div className="manage-rooms-content">
        <h2>ADD NEW ROOM</h2>
        <div className="form-row">
          <label>Room Number</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
  <input
    value={number}
    onChange={(e) => setNumber(e.target.value)}
    type="text"
    placeholder="Enter room number"
  />

  <select
    value={roomType}
    onChange={(e) => setRoomType(e.target.value)}
  >
    <option value="Single">Single</option>
    <option value="Double">Double</option>
  </select>
</div>

          <label>
            Activate or Deactivate
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          </label>
          <button className="save" onClick={handleAddRoom}>
            Save
          </button>
        </div>

        <h2>UPDATE & DELETE ROOM</h2>
        <div className="form-row">
          <label>Room Number</label>
          <input
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            type="text"
            placeholder="Search room"
          />
          <button className="search" onClick={handleSearch}>
            Search
          </button>
          {foundRoom && (
            <>
              <label>
                Activate or Deactivate
                <input
                  type="checkbox"
                  checked={searchActive}
                  onChange={(e) => setSearchActive(e.target.checked)}
                />
              </label>
              <button className="update" onClick={handleUpdate}>
                Update
              </button>
              <button className="delete" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>

        <h2>ALL ROOMS</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Type</th>
                <th>Activate</th>
                <th>Room Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.number}</td>
                  <td>{room.type}</td>
                  <td>{room.active ? "Yes" : "No"}</td>
                  <td>{room.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
