const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ⚡ Change this to your MongoDB connection string
const MONGO_URI = "mongodb+srv://kulriatamnna_db_user:66wFvy1k5sVJ3ZkO@expensetracker.jva7lbm.mongodb.net/?retryWrites=true&w=majority&appName=expenseTracker";

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

async function resetPasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // New plain passwords
    const newPasswords = {
      "alex23@gmail.com": "alex1234",
      "mike@gmail.com": "mike1234"
    };

    for (const [email, plainPassword] of Object.entries(newPasswords)) {
      const hashed = await bcrypt.hash(plainPassword, 10);
      await User.updateOne({ email }, { $set: { password: hashed } });
      console.log(`🔑 Reset password for ${email}. New password = ${plainPassword}`);
    }

    console.log("✅ All passwords updated successfully");
  } catch (err) {
    console.error ("Error:", err);
  } finally {
    mongoose.disconnect();
  }
}

resetPasswords();
