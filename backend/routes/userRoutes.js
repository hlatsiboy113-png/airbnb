const express = require('express');
const router = express.Router();

const {
  loginUser,
  registerUser,
  seedUsers,
  getMe,
  getUsers,
  updateUserRole,
} = require('../controllers/userController');

const { authMiddleware, requireAdmin } = require('../middleware/auth');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/seed', seedUsers);
router.get('/me', authMiddleware, getMe);
router.get('/', authMiddleware, requireAdmin, getUsers);
router.patch('/:id/role', authMiddleware, requireAdmin, updateUserRole);

module.exports = router;