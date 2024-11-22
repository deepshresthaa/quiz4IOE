const Quiz = require("../models/Quiz");

// Start Quiz
exports.startQuiz = async (req, res) => {
  const { subject } = req.body;

  try {
    const quiz = await Quiz.findOne({ subject });
    if (!quiz)
      return res.status(404).json({ msg: "Quiz not found for this subject" });

    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Submit Quiz & Calculate Score
exports.submitQuiz = async (req, res) => {
  const { userId, answers } = req.body;

  try {
    const quiz = await Quiz.findOne({ subject: answers.subject });
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) score += 1;
    });
    // Update user score in database (optional)
    res.json({
      msg: "Quiz submitted",
      score,
      totalQuestions: quiz.questions.length,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
