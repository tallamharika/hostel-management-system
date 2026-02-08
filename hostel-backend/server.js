require("dotenv").config(); // ✅ Load environment variables first
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use("/uploads", express.static("uploads"));
// ✅ Middleware: Allow frontend requests
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// ✅ Middleware: Parse incoming JSON requests
app.use(express.json());

// ✅ Logging Middleware (for debugging API calls)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, req.body);
  next();
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Root route
app.get("/", (req, res) => res.send("Smart Hostel Backend is running 🚀"));

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/students", require("./routes/students"));
app.use("/api/fees", require("./routes/fees"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/payments", require("./routes/payments"));
// Change this line in server.js
app.use("/api", require("./routes/bookings"));
app.use("/api/hostels", require("./routes/hostelRoutes"));
app.use("/api/customer-bookings", require("./routes/customerBookings"));
app.use("/api/customer/fees", require("./routes/customerFees"));

// ✅ Optional test routes for verification
app.get("/test", (req, res) => res.send("✅ Backend test working fine"));
app.get("/test-fees", (req, res) => res.send("✅ Fees route working fine"));
app.get("/test-bookings", (req, res) => res.send("✅ Bookings route working fine"));

// ✅ Serve static files (optional if you deploy frontend later)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Error handling middleware (safe for production)
app.use((err, req, res, next) => {
  console.error("⚠️ Server error:", err.message);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
