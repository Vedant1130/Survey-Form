const express = require("express");
const router = express.Router();
const surveyController = require("../controllers/surveyController");
const authMiddleware = require("../Middleware/authMiddleware");

// 🔹 Create a new survey entry
router.post("/submit", authMiddleware, surveyController.submitSurvey);

// 🔹 Get all surveys
router.get("/all", authMiddleware, surveyController.getAllSurveys);

// 🔹 Get a single survey by ID
router.get("/:id", authMiddleware, surveyController.getSurveyById);

// 🔹 Delete a survey by ID
router.delete("/delete/:id", surveyController.deleteSurvey);

module.exports = router;
