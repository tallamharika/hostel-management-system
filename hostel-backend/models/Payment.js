const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model("Payment", PaymentSchema);
