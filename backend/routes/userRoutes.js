const express = require('express');
const router = express.Router();
const { loginUser, seedUsers, getMe } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

router.post('/login', loginUser);
router.post('/seed', seedUsers);
router.get('/me', authMiddleware, getMe);

module.exports = router;
