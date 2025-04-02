const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Authentication Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/check-auth", authController.checkAuth); // Check if user is logged in

module.exports = router;
