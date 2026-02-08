const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    hostelName: String,

    firstName: String,
    lastName: String,
    email: String,
    phone: String,

    fatherName: String,
    motherName: String,
    address: String,
    college: String,
    aadhaar: String,

    roomNumber: String,

    moveInDate: Date,
    checkOutDate: Date,
    monthlyRent: Number,

    securityDeposit: { type: Number, default: 5000 },
    totalAmount: Number,

    status: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Pending" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);