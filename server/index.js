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

const app = express();

// ✅ MongoDB Connection
const DB_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/audit";
mongoose
  .connect(DB_URL, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 4500,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

const allowedOrigins = [
  "https://audit-app-eight.vercel.app",
  "https://audit-app-git-main-divyan154s-projects.vercel.app",
  "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());

//✅ Routes
app.use("/", authRoutes);
app.use("/", auditRoutes);
app.use("/", questionRoutes);

app.get("/home", (req, res) => {
  res.status(200).json({ message: "Welcome to the Audit App API" });
});
app.get("/user", authenticateToken, (req, res) => {
  // This route is protected by the authenticateToken middleware
  res.status(200).json({ name: req.user.name });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
