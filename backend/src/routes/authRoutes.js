const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { googleLogin, getMe } = require('../controllers/authController');

const router = express.Router();

router.post('/google', authMiddleware, googleLogin);

router.get('/me', authMiddleware, getMe);

module.exports = router;
