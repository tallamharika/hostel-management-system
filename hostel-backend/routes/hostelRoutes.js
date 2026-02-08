const express = require("express");
const router = express.Router();
const Hostel = require("../models/Hostel");

// PUBLIC – customers can see hostels
router.get("/", async (req, res) => {
  try {
    const hostels = await Hostel.find().sort({ createdAt: -1 });
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
