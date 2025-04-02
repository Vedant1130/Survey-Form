const Survey = require("../models/Survey");

// 🔹 Submit a new survey
exports.submitSurvey = async (req, res) => {
  try {
    const { name, mobile, address, familyMembers, products } = req.body;

    if (!name || !mobile || !address || !familyMembers) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found in request.",
      });
    }

    // ✅ Create new survey with createdBy field
    const newSurvey = new Survey({
      name,
      mobile,
      address,
      familyMembers,
      products: products || [], // ✅ Ensure default value
      createdBy: req.user._id, // ✅ Use `_id` properly
    });

    await newSurvey.save();

    res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
      survey: newSurvey,
    });
  } catch (err) {
    console.error("Error submitting survey:", err); // ✅ Improved error logging
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// 🔹 Get all surveys
exports.getAllSurveys = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ Get user ID from JWT token

    // ✅ Fetch only surveys that match the logged-in user's ID
    const surveys = await Survey.find({ createdBy: userId });
    res.status(200).json({
      success: true,
      message: "Surveys fetched successfully",
      surveys,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// 🔹 Get a single survey by ID
exports.getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    const productMRP = {
      Soap: 103,
      Shampoo: 374,
      Toothpaste: 194,
      "Hair Oil": 484,
      Facewash: 258,
      "Fairness Cream": 374,
      Lotion: 286,
      "Toilet Cleaner": 110,
      "Floor Cleaner": 132,
      "Laundry Liquid": 242,
      "Dishwash Bar": 88,
      "Dishwash Liquid": 165,
      Handwash: 440,
      "Green Tea": 209,
    };
    const productDP = {
      Soap: 83,
      Shampoo: 275,
      Toothpaste: 143,
      "Hair Oil": 358,
      Facewash: 187,
      "Fairness Cream": 275,
      Lotion: 209,
      "Toilet Cleaner": 83,
      "Floor Cleaner": 99,
      "Laundry Liquid": 187,
      "Dishwash Bar": 66,
      "Dishwash Liquid": 127,
      Handwash: 330,
      "Green Tea": 165,
    };
    const productsWithPrices = survey.products.map((product) => ({
      ...product._doc, // Convert Mongoose document to plain object
      mrp: productMRP[product.productName] || 0, // Assign MRP based on product name
      dp: productDP[product.productName] || 0, // Assign DP based on product name
    }));

    // ✅ Ensure `userId` exists before checking authorization
    if (survey.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({
      ...survey._doc,
      products: productsWithPrices,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔹 Delete a survey by ID
exports.deleteSurvey = async (req, res) => {
  try {
    const deletedSurvey = await Survey.findByIdAndDelete(req.params.id);

    if (!deletedSurvey)
      return res.status(404).json({ message: "Survey not found" });

    res.status(200).json({ message: "Survey deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
