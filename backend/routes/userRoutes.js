const express = require('express');
const router = express.Router();
const { loginUser, seedUsers } = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/seed', seedUsers);

module.exports = router;
