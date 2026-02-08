const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    type: { type: String, enum: ["Single", "Double"], default: "Single" },
    active: { type: Boolean, default: true },
    status: { type: String, default: "Not Booked" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

roomSchema.index({ number: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model("Room", roomSchema); 
