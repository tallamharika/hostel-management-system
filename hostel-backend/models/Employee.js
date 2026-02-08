const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mobile: { type: String, required: true },
    name: { type: String, required: true },
    fatherName: String,
    motherName: String,
    email: String,
    address: String,

    aadhaar: {
      type: String,
      required: true,
      unique: true,
    },

    designation: {
      type: String,
      enum: ["warden", "cook", "watchman", "cleaner"],
      required: true,
    },

    workingStatus: {
      type: String,
      enum: ["working", "not-working"],
      default: "working",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
