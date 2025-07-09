const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Email/Password Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Google OAuth Routes
router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

module.exports = router;
