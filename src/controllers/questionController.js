const Question=require("../models/Question");

exports.submitQuestion=async (req,res)=>{
    try{
        const {subject,questions}=req.body;
        console.log(req.body)
        const newQuestion=new Question({subject, questions});
        await newQuestion.save();
        res.status(201).send("New question added!")

    }
    catch(e){
        res.status(401).send("Question already exists");
    }
}

// const { subject } = req.body;

//     try {
//         const quiz = await Quiz.findOne({ subject });
//         if (!quiz) return res.status(404).json({ msg: 'Quiz not found for this subject' });

//         res.json(quiz);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }