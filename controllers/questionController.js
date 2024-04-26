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

    try {
        if (!req.file) {
            return res.status(400).send('No file has been uploaded.');
        }

        if (req.file.mimetype !== 'text/csv') {
            return res.status(400).send('File type is not CSV.');
        }
        let results = [];
        const lines = req.file.buffer.toString('utf8').split('\n');
        const header = lines[0].split(',').map(item => item.trim());
        const expectedHeader = ['category_id', 'question'];
        
        // Check if the header of the file has the expected one or not
        if (!arraysEqual(header, expectedHeader)) {
            return res.status(400).json({ error: 'Invalid CSV format. Header should include "category_id" and "question".' });
        }
        
        
        await Promise.all(lines.slice(1).map(async line => {
            const [category_id, question] = line.split(',').map(item => item.trim());
            if (category_id && question) {
                // Check if the category_id existing or not
                const categoryExists = await Category.findOne({ category_id: category_id });
                if (categoryExists != null) {
                    results.push({ category_id, question });
                } else {
                    console.log(`Category with ID ${category_id} does not exist. Skipping...`);
                }
            }
        }));

        if (results.length > 0) {
            await Questionare.insertMany(results);
            res.status(200).send({ 'msg': 'Questions added successfully.' });
        } else {
            res.status(200).send({ 'msg': 'No Questions are added.' });
        }
        
    } catch (err) {
        console.log('error===>', err);
        res.status(500).send('Internal Server Error');
    }
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}