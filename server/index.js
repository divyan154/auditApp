require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const authenticateToken = require("./middleware");
const mongoose = require("mongoose");
const upload = multer();
const cookieParser = require("cookie-parser");
const Question = require("./models/Questions");
mongoose
  .connect("mongodb://127.0.0.1:27017/audit")
  .then(() => {
    console.log("Connected to MongodB");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true, // allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api", authenticateToken, (req, res) => {
  console.log(req.user);
  res.send("Connected to backend");
});

app.post("/register", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.cookie("token", accessToken);

    res.send("Cookie is set");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/questions", async (req, res) => {
  const questions = await Question.find({});
  res.send(questions);
});

app.post("/audit", upload.none(), (req, res) => {
  console.log("Request for New Audit Recieved");
  console.log(req.body);
  res.send("Recived");
});
app.listen(3001, () => {
  console.log("Listening to port 3001");
});
