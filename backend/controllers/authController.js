const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔹 Signup Controller (Requires Name, Email, and Password)
exports.signup = async (req, res) => {
  try {
    // console.log("Signup request received:", req.body);
    const { name, email, password } = req.body;

    let user = await User.findOne({ $or: [{ name }, { email }] });

    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Login Controller (Requires Name and Password)
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });

    if (!user) {
      return res
        .status(403)
        .json({ message: "User not Found!!", success: false });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res
        .status(403)
        .json({ message: "Invalid Password", success: false });
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ name: user.name, _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    // Set JWT in HTTP-only cookie (More secure than storing in localStorage)
    res.cookie("token", jwtToken, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // Enables Secure flag in production
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({
      message: "Login successful",
      success: true,
      name,
      token: jwtToken, // ✅ Send the token in response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// 🔹 Logout Controller
exports.logout = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// 🔹 Check Auth Status
exports.checkAuth = (req, res) => {
  const token = req.cookies.token; // Get JWT from cookies

  if (!token) {
    return res.status(200).json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, "Hello");
    res.status(200).json({ isAuthenticated: true, user: decoded });
  } catch (error) {
    res.status(200).json({ isAuthenticated: false });
  }
};
