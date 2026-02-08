const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const auth = require("../middleware/authMiddleware");

// ✅ ADD ROOM (LOGIN-WISE DUPLICATE CHECK)
router.post("/", auth, async (req, res) => {
  try {
    const { number, active, type } = req.body;

    if (!number) {
      return res.status(400).json({ message: "Room number required" });
    }

    // 🔴 IMPORTANT FIX: check duplicate per login
    const existingRoom = await Room.findOne({
      number,
      createdBy: req.user.id,
    });

    if (existingRoom) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const room = new Room({
      number,
        type, 
      active,
      status: "Not Booked",
      createdBy: req.user.id,
    });

    await room.save();
    res.status(201).json({ message: "Room added", room });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ROOMS (LOGIN WISE)
router.get("/", auth, async (req, res) => {
  try {
    const { type } = req.query;

    let query = {
      createdBy: req.user.id,
    };

    if (type && type !== "All") {
      query.type = type;
    }

    const rooms = await Room.find(query);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ UPDATE ROOM (LOGIN SAFE)
router.put("/:number", auth, async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { number: req.params.number, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ room });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE ROOM (LOGIN SAFE)
router.delete("/:number", auth, async (req, res) => {
  try {
    const room = await Room.findOneAndDelete({
      number: req.params.number,
      createdBy: req.user.id,
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted", room });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ GET AVAILABLE ROOMS (CUSTOMER SIDE)
// Change this to find rooms created by the owner of that hostel
router.get("/available/:ownerId", async (req, res) => {
  try {
    const { type } = req.query; // 👈 ADD THIS

    const query = {
      createdBy: req.params.ownerId,
      status: "Not Booked",
      active: true,
    };

    if (type && type !== "All") {
      query.type = type; // 👈 FILTER BY TYPE
    }

    const rooms = await Room.find(query).sort({ number: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ COUNT AVAILABLE ROOMS (CUSTOMER DISPLAY)
router.get("/count/:ownerId", async (req, res) => {
  try {
    const count = await Room.countDocuments({
      createdBy: req.params.ownerId,
      active: true,
      status: "Not Booked",
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ ADMIN: GET ALL ROOMS (no filtering)
router.get("/admin", auth, async (req, res) => {
  try {
    const rooms = await Room.find({
      createdBy: req.user.id,
    }).sort({ number: 1 });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ ADMIN: AVAILABLE ROOMS FOR NEW STUDENT
router.get("/available", auth, async (req, res) => {
  try {
    const { type } = req.query;

    const query = {
      createdBy: req.user.id,
      active: true,
      status: "Not Booked",
    };

    if (type && type !== "All") {
      query.type = type;
    }

    const rooms = await Room.find(query).sort({ number: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET AVAILABLE ROOMS BY HOSTEL (CUSTOMER SIDE)
module.exports = router;






