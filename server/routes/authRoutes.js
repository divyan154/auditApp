const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");


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

const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    console.log("request to login received");
    const { email, password } = req.body;
    console.log("Received login details:", email, password);

    const user = await User.findOne({ email });
    console.log("User found in DB:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials (user not found)" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("Password match:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials (wrong password)" });
    }

    const token = jwt.sign(
      { name: user.name, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});



router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out" });
});

module.exports = router;
