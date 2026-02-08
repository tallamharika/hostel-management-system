const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

/*
 GET customer payment details based on bookings
*/
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔥 fetch bookings of logged-in user
    const bookings = await Booking.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    // 🔥 transform booking → fee-style data
    const fees = bookings.map((b) => ({
      month: b.createdAt.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      type: "Hostel Rent",
      amount: b.monthlyRent,
      paidDate: b.status === "Confirmed" ? b.createdAt : null,
      status: b.status === "Confirmed" ? "Paid" : "Pending",
    }));

    // 🔥 calculate totals
    const totalPaid = fees
      .filter((f) => f.status === "Paid")
      .reduce((sum, f) => sum + f.amount, 0);

    const pending = fees
      .filter((f) => f.status === "Pending")
      .reduce((sum, f) => sum + f.amount, 0);

    res.json({
      totalPaid,
      pending,
      fees,
    });
  } catch (err) {
    console.error("❌ Customer fees error:", err);
    res.status(500).json({ message: "Failed to fetch fees" });
  }
});

module.exports = router;
