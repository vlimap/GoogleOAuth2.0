const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.post('/google', authMiddleware, AuthController.googleLogin);

router.get('/me', authMiddleware, AuthController.getMe);

module.exports = router;
