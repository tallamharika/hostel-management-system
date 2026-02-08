const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Student = require("../models/Student");

/**
 * GET /api/customer-bookings/:userId
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("🔥 Searching bookings for userId:", userId);

    const bookings = await Booking.find({
      createdBy: new mongoose.Types.ObjectId(userId) // ✅ FINAL FIX
    });

    console.log("🔥 bookings found:", bookings.length);

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* EXTEND BOOKING */
router.put("/extend/:id", async (req, res) => {
  try {
    const { checkOutDate } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { checkOutDate },
      { new: true }
    );

    if (updatedBooking?.email) {
      await Student.findOneAndUpdate(
        { email: updatedBooking.email },
        { checkOutDate }
      );
    }

    res.json(updatedBooking);
  } catch (err) {
    console.error("❌ Error extending booking:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
