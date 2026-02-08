const mongoose = require("mongoose");

const FeeSchema = new mongoose.Schema(
  {
    mobile: { type: String, required: true },
    name: { type: String, required: true },
    roomNumber: { type: String, required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },

    // 🔐 IMPORTANT
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", FeeSchema);
