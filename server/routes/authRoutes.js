const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Register route
router.post("/register", async (req, res) => {
  const { name, password, email } = req.body.formData;
  const user = await User.findOne({ name });
  if (user) {
    return res.status(400).send("User Already Registered");
  }

  const hashedPassword = await bcrypt.hash(password, 2);
  const newUser = new User({ name, password: hashedPassword, email });
  await newUser.save();

  res.status(200).send("User Registered Successfully");
});

// Login route
router.post("/login", async (req, res) => {
  try {
    console.log("request to login received");

    const { name, password } = req.body;
    console.log("Received login details:", name, password);

    const user = await User.findOne({ name });
    console.log("User found in DB:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { name: user.name, userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // REQUIRED in production for HTTPS
      sameSite: "None", // REQUIRED for cross-site cookie sharing
      maxAge: 7 * 24 * 60 * 60 * 1000, // Optional: expires in 7 days
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out" });
});

module.exports = router;
