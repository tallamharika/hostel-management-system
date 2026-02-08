require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Hostel = require("../models/Hostel"); // ✅ IMPORTANT
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// ================= MULTER SETUP =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const JWT_SECRET = process.env.JWT_SECRET || "fallbackSecretKey";

// ================= JWT MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// ================= TEST ROUTES =================
router.get("/login-test", (req, res) => {
  res.send("✅ Login route is working!");
});

// ================= REGISTER =================
router.post("/register", upload.single("file"), async (req, res) => {
  try {
    const { name, email, password, role, location, roomsAvailable, roomDetails } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
    };

    if (role === "management") {
      userData.location = location;
      userData.roomsAvailable = roomsAvailable;
      userData.roomDetails = roomDetails;
      if (req.file) userData.filePath = req.file.path;
    }

    // ✅ SAVE USER
    const user = new User(userData);
    await user.save();

    // ==================================================
    // ✅ AUTO-CREATE HOSTEL FOR MANAGEMENT USER
    // ==================================================
    if (user.role === "management") {
      await Hostel.create({
        name: user.name,
        location: user.location,
        roomsAvailable: user.roomsAvailable,
        priceRange: user.roomDetails,
        image: user.filePath,
        createdBy: user._id,
      });
    }

    // ✅ JWT TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ Register error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password, selectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "You are not registered. Please register first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
// 🚨 ROLE MISMATCH CHECK (CRITICAL FIX)
if (selectedRole && user.role !== selectedRole) {
  return res.status(403).json({
    message: `❌ You are registered as ${user.role}. Please login from the correct section.`,
  });
}

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ================= GET USER =================
router.get("/user/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= UPDATE USER =================
router.put("/user/:id", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;