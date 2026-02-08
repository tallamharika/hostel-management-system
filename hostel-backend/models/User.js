const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "management"],
      default: "customer",
    },

    // ----------------- Customer profile fields -----------------
    phone: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
      default: "",
    },
    emergencyName: {
      type: String,
      default: "",
    },
    emergencyPhone: {
      type: String,
      default: "",
    },
    emergencyRelationship: {
      type: String,
      default: "",
    },

    // ----------------- Hostel management-specific fields -----------------
    location: {
      type: String,
      required: function () {
        return this.role === "management";
      },
    },
    roomsAvailable: {
      type: Number,
      required: function () {
        return this.role === "management";
      },
    },
    roomDetails: {
      type: String, // Example: "Single - ₹5000, Double - ₹8000"
    },
    filePath: {
      type: String, // store uploaded file path
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
