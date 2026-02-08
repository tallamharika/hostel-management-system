const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking");

router.get("/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      createdBy: new mongoose.Types.ObjectId(req.params.userId),
    });

    const fees = [];

    bookings.forEach((b) => {
      const month = new Date(b.moveInDate)
        .toLocaleString("default", { month: "long", year: "numeric" });

      // ✅ Security Deposit (Paid)
      fees.push({
        month,
        type: "Security Deposit",
        amount: b.securityDeposit || 5000,
        status: "Paid",
        paidDate: b.createdAt,
      });

      // ✅ Monthly Rent
      fees.push({
        month,
        type: "Hostel Rent",
        amount: b.monthlyRent,
        status: b.status === "Confirmed" ? "Paid" : "Pending",
        paidDate: b.status === "Confirmed" ? b.createdAt : null,
        dueDate: b.moveInDate,
      });
    });

    res.json(fees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
