module.exports = (quiz, answers) => {
    let score = 0;
    quiz.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) score += 1;
    });
    return score;
};
