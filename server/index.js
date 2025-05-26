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

// ✅ CORS Setup
const allowedOrigins = [
  "https://audit-app-eight.vercel.app",
  "https://audit-app-git-main-divyan154s-projects.vercel.app",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean); // remove undefined/null values

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ✅ Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/", authRoutes);
app.use("/", auditRoutes);
app.use("/", questionRoutes);

app.get("/user", authenticateToken, (req, res) => {
  res.send({ name: req.user.name });
});

app.listen(3001, () => {
  console.log("🚀 Server listening on port 3001");
});
