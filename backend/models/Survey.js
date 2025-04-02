const mongoose = require("mongoose");

const SurveySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, match: /^[0-9]{10}$/ }, // Ensures a 10-digit number
    address: { type: String, required: true },
    familyMembers: { type: Number, required: true, min: 1 }, // At least 1 family member
    products: [
      {
        productName: {
          type: String,
          required: true,
          enum: [
            "Soap",
            "Shampoo",
            "Toothpaste",
            "Hair Oil",
            "Facewash",
            "Fairness Cream",
            "Lotion",
            "Toilet Cleaner",
            "Floor Cleaner",
            "Laundry Liquid",
            "Dishwash Bar",
            "Dishwash Liquid",
            "Handwash",
            "Green Tea",
          ],
        },
        brand: { type: String, required: true }, // User enters the brand name
        quantity: { type: Number, required: true, min: 0 }, // User enters quantity
        price: { type: Number, required: true, min: 0 },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // ✅ Add this
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Survey", SurveySchema);
