const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Unique username
  email: { type: String, required: true, unique: true }, // Email required for registration
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
