const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const PaymentSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
});

const Payment = mongoose.model("Payment", PaymentSchema);

// Check payment for month
router.get("/:employeeId/:month", async (req, res) => {
  try {
    const { employeeId, month } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid Employee ID" });
    }

    const regex = new RegExp(`^${month}`);
    const payment = await Payment.findOne({
      employeeId,
      date: { $regex: regex },
    });

    res.json({
      exists: !!payment,
      payment: payment || null,
    });
  } catch {
    res.status(500).json({ message: "Error checking payment" });
  }
});

// Save payment
router.post("/", async (req, res) => {
  try {
    const { employeeId, date, amount } = req.body;

    if (!employeeId || !date || !amount) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const month = date.slice(0, 7);
    const regex = new RegExp(`^${month}`);

    const exists = await Payment.findOne({
      employeeId,
      date: { $regex: regex },
    });

    if (exists) {
      return res.status(400).json({ message: "Payment already done for this month" });
    }

    const payment = new Payment({ employeeId, date, amount });
    await payment.save();

    res.status(201).json({ message: "Payment saved", payment });
  } catch {
    res.status(500).json({ message: "Error saving payment" });
  }
});

// Get payments
router.get("/", async (req, res) => {
  try {
    const { employeeId, date } = req.query;
    if (!employeeId) return res.status(400).json({ message: "Employee ID required" });

    const query = { employeeId };
    if (date) query.date = date;

    const payments = await Payment.find(query);
    res.json({ payments });
  } catch {
    res.status(500).json({ message: "Error fetching payments" });
  }
});

module.exports = router;
