const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// 🔹 Local Strategy (Login with Name & Password)
passport.use(
  new LocalStrategy(
    { usernameField: "name" }, // Using "name" instead of "email"
    async (name, password, done) => {
      try {
        const user = await User.findOne({ name });

        if (!user) return done(null, false, { message: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 🔹 Serialize User (Store user ID in session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 🔹 Deserialize User (Retrieve user details from session)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
