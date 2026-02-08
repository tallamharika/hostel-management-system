const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Room = require("../models/Room");
const auth = require("../middleware/authMiddleware");

// ✅ ADD STUDENT
router.post("/", auth, async (req, res) => {
  const { mobile, name, aadhaar, roomNumber } = req.body;

  if (!mobile || !name || !aadhaar || !roomNumber) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const existingStudent = await Student.findOne({
      aadhaar,
      createdBy: req.user.id,
    });

    if (existingStudent) {
      return res.status(400).json({ message: "Duplicate Aadhaar number" });
    }

    const room = await Room.findOne({
      number: roomNumber,
      active: true,
      createdBy: req.user.id,
    });

    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.status === "Booked")
      return res.status(400).json({ message: "Room already booked" });

    const student = new Student({
      ...req.body,
      roomType: room.type,      // ✅ FIX
  roomStatus: "Booked",     // ✅ FIX
      createdBy: req.user.id,
      livingStatus: "Living",
    });

    await student.save();

    room.status = "Booked";
    await room.save();

    res.status(201).json({ message: "Student saved successfully", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL LIVING STUDENTS (WITH ROOM STATUS)
// students.js
router.get("/", auth, async (req, res) => {
  try {
    const students = await Student.find({
      createdBy: req.user.id,
    livingStatus: "Living",
    }).lean();


    for (let s of students) {
  s.roomStatus = "Booked";
}


    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET LEAVED STUDENTS (WITH ROOM STATUS)
router.get("/leaved", auth, async (req, res) => {
  try {
    const students = await Student.find({
      createdBy: req.user.id,
      livingStatus: "Leaved",
    }).lean();

    for (let s of students) {
  const room = await Room.findOne({
    number: s.roomNumber,
    createdBy: req.user.id,
  });

  s.roomStatus = room ? room.status : "Not Assigned";
  s.roomType = room ? room.type : null; // ✅ ADD THIS
}


    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ FIND STUDENT BY MOBILE
router.get("/find/:mobile", auth, async (req, res) => {
  try {
    const student = await Student.findOne({
      mobile: req.params.mobile.trim(),
      createdBy: req.user.id,
    });

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE STUDENT
router.put("/:mobile", auth, async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { mobile: req.params.mobile.trim(), createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    const livingStudents = await Student.find({
      roomNumber: student.roomNumber,
      livingStatus: "Living",
      createdBy: req.user.id,
    });

    const roomStatus = livingStudents.length ? "Booked" : "Not Booked";

    await Room.findOneAndUpdate(
      { number: student.roomNumber, createdBy: req.user.id },
      { status: roomStatus }
    );

    res.json({ message: "Student updated", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE STUDENT
router.delete("/:mobile", auth, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      mobile: req.params.mobile.trim(),
      createdBy: req.user.id,
    });

    if (!student) return res.status(404).json({ message: "Student not found" });

    const livingStudents = await Student.find({
      roomNumber: student.roomNumber,
      livingStatus: "Living",
      createdBy: req.user.id,
    });

    const roomStatus = livingStudents.length ? "Booked" : "Not Booked";

    await Room.findOneAndUpdate(
      { number: student.roomNumber, createdBy: req.user.id },
      { status: roomStatus }
    );

    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/checkout/:id", auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.livingStatus = "Leaved";
    student.checkOutDate = new Date();
    await student.save();

    // Free room
    await Room.findOneAndUpdate(
      {
        number: student.roomNumber,
        createdBy: req.user.id,
      },
      { status: "Not Booked" }
    );

    res.json({ message: "Student checked out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Checkout failed" });
  }
});

module.exports = router;