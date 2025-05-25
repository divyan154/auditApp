const mongoose = require("mongoose");
const Question = require("./models/Questions.js");
mongoose
  .connect("mongodb://127.0.0.1:27017/audit")
  .then(() => {
    console.log("Connected to MongodB");
  })
  .catch((err) => {
    console.log(err);
  });
const questions = [
  { text: "Current Location?", questionType: "location" },
  { text: "Name of the Outlet?", questionType: "name" },
  { text: "Cleanliness of the Outlet", questionType: "rating" },
  { text: "Photograph of the Outlet", questionType: "image" },
];
const setQuestions = async () => {
  await Question.deleteMany({});
  try {
    await Promise.all(
      questions.map(async (q) => {
        const newQuestion = new Question(q);
        await newQuestion.save();
      })
    );
    console.log("All questions saved successfully.");
  } catch (err) {
    console.error("Error saving questions:", err);
  }
};

// setQuestions();
