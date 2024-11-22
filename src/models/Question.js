const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  questions: [
    {
      question: { type: String, unique: true },
      options: [String],
      correctAnswer: String,
    },
  ],
});

module.exports = mongoose.model("questions", questionSchema);
