const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authenticateToken = require("./middleware");

const auditRoutes = require("./routes/auditRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const questionRoutes = require("./routes/questions.js");

//Connect to mongodb
const DB_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/audit";

mongoose
  .connect(DB_URL, {
    // Add these for better production stability:
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  });

const app = express();

const frontend_url = "https://audit-app-dusky.vercel.app";
const corsOptions = {
  origin: [
    frontend_url, // for local development
  ],
  credentials: true, // allow cookies to be sent
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/", auditRoutes);
app.use("/", questionRoutes);

app.get("/user", authenticateToken, (req, res) => {
  // console.log(req.user);
  res.send(req.user.name);
});

app.listen(3001, () => {
  console.log("Listening to port 3001");
});
