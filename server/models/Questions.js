const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  // Core fields
  text: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
  },
  questionType: {
    type: String,

    default: "text",
  },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
