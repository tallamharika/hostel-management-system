const express = require("express");
const router = express.Router();
const Fee = require("../models/Fee");
const auth = require("../middleware/authMiddleware");

// ✅ TEST
router.get("/test", auth, (req, res) => {
  res.send("Fees router working");
});

// ✅ ADD FEE (LOGIN-WISE)
router.post("/", auth, async (req, res) => {
  try {
    const { mobile, name, roomNumber, month, amount } = req.body;

    if (!mobile || !month || !amount) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const mobileStr = String(mobile).trim();

    const existing = await Fee.findOne({
      mobile: mobileStr,
      month,
      createdBy: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: `Fee already paid for ${month}` });
    }

    const fee = new Fee({
      mobile: mobileStr,
      name,
      roomNumber,
      month,
      amount,
      createdBy: req.user.id, // 🔐 IMPORTANT
    });

    await fee.save();

    res.status(201).json({ message: "Fee saved successfully", fee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET FEES (mobile OR mobile + month) — LOGIN-WISE
router.get("/", auth, async (req, res) => {
  try {
    let { mobile, month } = req.query;

    if (!mobile || mobile.trim() === "") {
      return res.status(400).json({ message: "Mobile number required" });
    }

    mobile = String(mobile).trim();

    const query = {
      mobile,
      createdBy: req.user.id, // 🔐 IMPORTANT
    };

    if (month && month.trim() !== "") {
      query.month = month.trim();
    }

    const fees = await Fee.find(query).sort({ createdAt: -1 });

    res.json({ fees }); // always array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE FEE (OPTIONAL)
router.delete("/:id", auth, async (req, res) => {
  try {
    const fee = await Fee.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!fee) return res.status(404).json({ message: "Fee not found" });

    res.json({ message: "Fee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
