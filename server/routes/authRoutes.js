const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, password, email } = req.body.formData;
  console.log(name, email, password);
  const user = await User.findOne({ name });
  if (user) {
    res.send("User Already registered");
    return;
  }
  //   console.log("user", user);
  const hashedPassword = await bcrypt.hash(password, 2);
  const newUser = new User({ name, password: hashedPassword, email });
  //   console.log("new user:", newUser);
  await newUser.save();
  res.status(200).send("User Registered SuccessFully");
});

router.post("/login", async (req, res) => {
  console.log("request to login recieved");
  try {
    const { name, password } = req.body.formData;

    // 1. Find user
    const user = await User.findOne({ name });
    // console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Create payload with only necessary data
    const payload = {
      userId: user._id,
      name: user.name,
    };

    // 4. Sign token with expiration
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.send("Cookie is set");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out" });
});

module.exports = router;
