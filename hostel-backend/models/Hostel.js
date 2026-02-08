const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    roomsAvailable: { type: Number, required: true },
    priceRange: { type: String, required: true },
    image: { type: String }, // image URL or path
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // management user
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hostel", hostelSchema);
