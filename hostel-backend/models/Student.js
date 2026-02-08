const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  mobile: String,
  name: String,
  fatherName: String,
  motherName: String,
  email: String,
  address: String,
  college: String,
  aadhaar: String,
  roomNumber: String,
  roomType: {
    type: String,
    enum: ["Single", "Double"],
    default: null, // keeps old data safe
  },
  roomStatus: {
  type: String,
  default: "Booked",
},
  livingStatus: {
    type: String,
    default: "Living",
  },
checkInDate: {
    type: Date,
    default: Date.now,
  },

  checkOutDate: {
    type: Date,
    default: null,
  },
  // 🔒 OWNER OF THIS STUDENT
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);