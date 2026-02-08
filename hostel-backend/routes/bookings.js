const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Student = require("../models/Student");
const Room = require("../models/Room");

/* =============================== */
/* ✅ CUSTOMER BOOKING */
/* =============================== */
router.post("/book-now", async (req, res) => {
  try {
    const {
      hostelName,
      firstName,
      lastName,
      email,
      phone,
      fatherName,
      motherName,
      address,
      college,
      aadhaar,
      roomNumber,
      monthlyRent,
      userId,
      moveInDate,
      checkOutDate,
      ownerId,
    } = req.body;

    // 1️⃣ Validate room
    const room = await Room.findOne({
      number: roomNumber,
      status: "Not Booked",
      active: true,
      createdBy:ownerId,
    });

    if (!room) {
      return res
        .status(400)
        .json({ message: "Selected room not available" });
    }

    // 2️⃣ Create booking
    const booking = await Booking.create({
      hostelName,
      firstName,
      lastName,
      email,
      phone,
      fatherName,
      motherName,
      address,
      college,
      aadhaar,
      roomNumber,
      monthlyRent,
      securityDeposit: 5000,
      totalAmount: monthlyRent + 5000,
      status: "Confirmed",
      paymentStatus: req.body.paymentStatus || "Paid",
      moveInDate,
      checkOutDate,
      userId: new mongoose.Types.ObjectId(userId),
      createdBy: new mongoose.Types.ObjectId(ownerId),
    });

    // 3️⃣ Create student (MANAGEMENT SIDE)
    await Student.create({
      mobile: phone,
      name: `${firstName} ${lastName}`,
      fatherName,
      motherName,
      email,
      address,
      college,
      aadhaar,
      roomNumber,
       roomType: room.type, 
       roomStatus: "Booked",         // ✅ ADD
  checkInDate: moveInDate,      // ✅ ADD
  checkOutDate: checkOutDate,   // ✅ ADD
      livingStatus: "Living",
      createdBy: new mongoose.Types.ObjectId(ownerId),
    });

    // 4️⃣ Update room
    room.status = "Booked";
    await room.save();

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =============================== */
/* ✅ GET CUSTOMER BOOKINGS */
/* =============================== */
router.get("/customer-bookings/:userId", async (req, res) => {
  
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("❌ Customer booking fetch error:", err);
    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
}
);
/* =============================== */
/* ✅ CUSTOMER FEES (FROM BOOKINGS) */
/* =============================== */
router.get("/customer/fees/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    // Convert bookings → fee records
    const fees = bookings.map((b) => ({
  _id: b._id,              // ⭐ REQUIRED FOR PAY BUTTON
  month: b.moveInDate
    ? new Date(b.moveInDate).toLocaleString("default", {
        month: "long",
        year: "numeric",
      })
    : "N/A",
  type: "Hostel Booking",
  amount: b.totalAmount,
  paidDate:
    (b.paymentStatus || "Pending") === "Paid"
      ? new Date(b.createdAt).toLocaleDateString()
      : null,
  status: b.paymentStatus || "Pending",
}));

    let totalPaid = 0;
    let pending = 0;

    fees.forEach((f) => {
      if (f.status === "Paid") totalPaid += f.amount;
      else pending += f.amount;
    });

    res.json({
      fees,
      totalPaid,
      pending,
    });
  } catch (err) {
    console.error("❌ Fee fetch error:", err);
    res.status(500).json({ message: "Failed to fetch fees" });
  }
});
/* =============================== */
/* ✅ PAY PENDING FEES */
/* =============================== */
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/customer/fees/pay/:bookingId",
  authMiddleware,
  async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.bookingId);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      booking.paymentStatus = "Paid";
      booking.paidDate = new Date();
      await booking.save();

      res.json({
        message: "Payment successful",
        booking,
      });
    } catch (err) {
      console.error("❌ Payment error:", err);
      res.status(500).json({ message: "Payment failed" });
    }
  }
);

module.exports = router; 










