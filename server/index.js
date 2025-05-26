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
    socketTimeoutMS: 4500, // Close sockets after 45s of inactivity
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  });

const app = express();

const allowedOrigins = [
  "https://audit-app-eight.vercel.app",
  "https://audit-app-git-main-divyan154s-projects.vercel.app",
  "http://localhost:3000", // for local development
  process.env.FRONTEND_URL, // from environment variables
].filter(Boolean); // removes any undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.includes("vercel.app") || // Allow all Vercel preview URLs
      origin.match(/\.vercel\.app$/)
    ) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "X-CSRF-Token",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  exposedHeaders: ["Set-Cookie", "Authorization"],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/", auditRoutes);
app.use("/", questionRoutes);

app.get("/user", authenticateToken, (req, res) => {
  // console.log(req.user);
res.send({ name: req.user.name });
  
});

app.listen(3001, () => {
  console.log("Listening to port 3001");
});
