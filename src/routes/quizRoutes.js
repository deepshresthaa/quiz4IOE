const express = require("express");
const { startQuiz, submitQuiz } = require("../controllers/quizController");
const { logoutUser } = require("../controllers/authController");
const { submitQuestion } = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const Question = require("../models/Question");
// const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const quizMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");


// let currentUser;


router.post("/question", submitQuestion);

router.get("/question", async (req, res) => {
  try {
    const questions = await Mathematic.find();
    res.status(200).send(questions);
  } catch (e) {
    res.status(400).send("coudn't get the questions data!!");
  }
});

router.get("/takequiz", authMiddleware, async (req, res) => {
  res.render("home", {
    isAuthenticated: true,
    categories: [
      {
        name: "Physics",
        icon: "https://img.icons8.com/color/96/physics.png",
        link: `http://localhost:${process.env.PORT}/quiz/physics`,
      },
      {
        name: "Math",
        icon: "https://img.icons8.com/color/96/math.png",
        link: `http://localhost:${process.env.PORT}/quiz/mathematics`,
      },
      {
        name: "Chemistry",
        icon: "https://img.icons8.com/?size=100&id=plfeszuBxWOo&format=png&color=000000",
        link: `http://localhost:${process.env.PORT}/quiz/chemistry`,
      },
      {
        name: "English",
        icon: "https://img.icons8.com/color/96/language.png",
        link: `http://localhost:${process.env.PORT}/quiz/english`,
      }
    ],
  });
});
router.get("/:subject", authMiddleware, async (req, res) => {
  console.log("req params",req.params)
  const subject = req.params.subject; // Extract category from the URL
  try {
    // Fetch questions for the given subject from MongoDB
    const quizData = await Question.findOne({ subject }); // Use findOne() to get a single quiz by subject

    if (quizData && quizData.questions) {
      // console.log("Fetched questions:", quizData.questions);
      res.render("questions", {
        subject,
        questions: quizData.questions, // Pass the questions to the template
      });
    } else {
      res.status(404).send("Questions not found for the specified subject.");
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).send("Failed to load quiz questions.");
  }
});
router.get("/dashboard/score", async (req, res) => {
  const { subject } = req.query; // Get the subject (quiz category) from query params
  const answers = req.query; // Get the answers submitted from the quiz form

  let score = 0;

  try {
    // Fetch the quiz data for the given subject
    const quizData = await Question.findOne({ subject }); // Retrieve the quiz based on subject

    if (quizData && quizData.questions) {
      const questions = quizData.questions; // Access the questions array

      // Iterate over the questions and compare selected answers with correct answers
      questions.forEach((question, index) => {
        const selectedAnswer = answers[`question_${index}`]; // Get the selected answer for each question
        const correctAnswer = question.correctAnswer; // Get the correct answer from the database

        // Compare selected answer with correct answer
        if (selectedAnswer === correctAnswer) {
          score++; // Increment score for correct answers
        }
      });

      // Send the score back to the user
      res.send(`Your score is: ${score} out of ${questions.length}`);
    } else {
      res
        .status(404)
        .send("Quiz questions not found for the specified subject.");
    }
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    res.status(500).send("Failed to load quiz questions.");
  }
});

// POST route for calculating score
router.post("/dashboard/score", authMiddleware, async (req, res) => {
  const { subject, ...answers } = req.body; // Get subject and answers from POST body
  let score = 0;
  // console.log(subject);
  try {
    // Fetch the quiz data for the given subject from the database
    const quizData = await Question.findOne({ subject });

    if (quizData && quizData.questions) {
      const questions = quizData.questions;
      // Iterate over the questions and compare selected answers with correct answers
      questions.forEach((question, index) => {
        const selectedAnswer = answers[`question_${index}`]; // Get the selected answer from body
        const correctAnswer = question.correctAnswer;

        // Compare selected answer with correct answer
        if (selectedAnswer === correctAnswer) {
          score++;
        }
      });







      // console.log("USER:",loggedUser);








      // Return the score to the user
      res.render("dashboard", { score, total: questions.length }); // Return score and total questions
    } else {
      res
        .status(404)
        .send("Quiz questions not found for the specified subject.");
    }
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    res.status(500).send("Failed to load quiz questions.");
  }
});

router.post("/start", authMiddleware, startQuiz);
router.post("/submit", authMiddleware, submitQuiz);
module.exports = router;
