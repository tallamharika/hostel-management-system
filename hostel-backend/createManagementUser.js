import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "YOUR_MONGODB_CONNECTION_STRING";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model("User", userSchema);

async function createManagementUser() {
  try {
   await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");

    // Delete any existing admin
    await User.deleteMany({ email: "admin@hostel.com" });
    console.log("🗑️ Existing admin user(s) deleted (if any)");

    // Hash the password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Create new management user
    const newUser = new User({
      name: "Hostel Admin",
      email: "admin@hostel.com",
      password: hashedPassword,
      role: "management",
    });

    await newUser.save();
    console.log("✅ Management user created successfully!");
    console.log("Email: admin@hostel.com | Password: 123456 | Role: management");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating management user:", err);
    process.exit(1);
  }
}

createManagementUser();
