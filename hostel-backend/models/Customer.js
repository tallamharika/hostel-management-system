const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  role: { type: String, default: "customer" },
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
  room: { type: String },
});

module.exports = mongoose.model("Customer", CustomerSchema);
