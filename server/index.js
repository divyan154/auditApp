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
