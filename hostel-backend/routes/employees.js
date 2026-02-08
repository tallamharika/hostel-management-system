const express = require("express");
const Employee = require("../models/Employee");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    const employee = new Employee({
      ...req.body,
      createdBy: req.user.id,
    });
    await employee.save();
    res.status(201).json({ message: "Employee saved successfully!", employee });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Aadhaar must be unique" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// READ ALL (per user)
router.get("/", auth, async (req, res) => {
  try {
    const employees = await Employee.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
});

// FIND BY MOBILE
router.get("/find/:mobile", auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      mobile: req.params.mobile.trim(),
      createdBy: req.user.id,
    });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ employee });
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee", error: err.message });
  }
});

// GET BY ID
router.get("/:id", auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee", error: err.message });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee updated successfully", employee });
  } catch (err) {
    res.status(500).json({ message: "Error updating employee", error: err.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee", error: err.message });
  }
});

// LEAVED EMPLOYEES
router.get("/leaved/all", auth, async (req, res) => {
  try {
    const employees = await Employee.find({
      createdBy: req.user.id,
      workingStatus: "not-working",
    }).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaved employees", error: err.message });
  }
});

module.exports = router;
