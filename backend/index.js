if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
require("./config/passport"); // Load Passport Config
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const surveyRoutes = require("./routes/surveyRoutes");

const MONGO_URL = process.env.MONGODB_ATLAS_URL
main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const app = express();

// 🔹 CORS Middleware (Allow frontend requests)
app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your Vite frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sessions
// app.use(
//   session({
//     secret: "mysecretkey", // Change this to a strong secret
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: MONGO_URL, // Store sessions in MongoDB
//       collectionName: "sessions",
//     }),
//     cookie: {
//       expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     },
//   })
// );

// // Passport Middleware
// app.use(passport.initialize());
// app.use(passport.session());

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
