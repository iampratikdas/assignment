const moment = require('moment');
const { Questionare } = require('../models/questionare');
const { Category } = require('../models/categories');

exports.createQuestion = async (req, res) => {
    try {
        const question_obj = {
            created_at: moment().unix(),
            category_id: req.body.category_id,
            question: req.body.question
        };
        const newQuestion = new Questionare(question_obj);
        await newQuestion.save();
        res.status(200).json({ "msg": "New newQuestion Created" });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

exports.listQuestions = async (req, res) => {
    try {
        let questionlist_categories = await Category.aggregate([
            {
                $lookup: {
                    from: "questionares", 
                    localField: "category_id",
                    foreignField: "category_id",
                    as: "questions",
                },
            },
        ]);
        res.status(200).json({ questionlist_categories });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

exports.addBulkQuestion = async (req, res) => {
    console.log("files===>", req.file)

    try {
        if (!req.file) {
            return res.status(400).send('No file has been uploaded.');
        }

        if (req.file.mimetype !== 'text/csv') {
            return res.status(400).send('File type is not CSV.');
        }

        const results = [];

        //Here  Parsing the CSV file
        req.file.buffer
            .toString('utf8')
            .split('\n')
            .slice(1) 
            .forEach(line => {
                const [category_id, question] = line.split(',').map(item => item.trim());
                if (category_id && question) {
                    results.push({ category_id, question });
                }
            });
        await Questionare.insertMany(results);

        res.status(200).send({'msg':'Questions added successfully.'});
    } catch (err) {
        console.log('error===>', err);
        res.status(500).send('Internal Server Error');
    }
}