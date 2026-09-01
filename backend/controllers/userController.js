const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Generate JWT token with user ID payload
 * @param {string} userId - MongoDB user ID
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

/**
 * @desc    Login user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    res.status(200).json({
      status: 'success',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the currently authenticated user's profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Seed test users for development only
 * @route   POST /api/users/seed
 * @access  Public in development, blocked in production
 */
const seedUsers = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return next(new AppError('Not found', 404));
    }
    await User.deleteMany();
    const users = await User.create([
      {
        username: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        username: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password321',
        role: 'host',
      },
      {
        username: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      },
    ]);
    res.status(201).json({ status: 'success', data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, seedUsers, getMe };
