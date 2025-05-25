const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware.js");

const Question = require("../models/Questions.js");

router.get("/questions", authenticateToken, async (req, res) => {
  const questions = await Question.find({});
  res.send(questions);
});

module.exports = router;
