const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
router.post('/create', questionController.createQuestion);
router.get('/list', questionController.listQuestions);
router.post('/addbulkquestion', questionController.addBulkQuestion);
module.exports = router;