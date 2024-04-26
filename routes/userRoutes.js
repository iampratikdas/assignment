// userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.post('/signup', userController.signUp);
router.get('/profile/:id', userController.getUserProfile);
router.patch('/profile/:id', userController.editUserProfile);

module.exports = router;