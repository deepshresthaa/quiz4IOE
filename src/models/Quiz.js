const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    questions: [
        {
            question: String,
            options: [String],
            correctAnswer: String,
        }
    ]
});

module.exports = mongoose.model('Quiz', quizSchema);
