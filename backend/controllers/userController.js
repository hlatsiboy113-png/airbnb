const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const DEFAULT_USERS = [
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
];

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

const ensureDefaultUsers = async () => {
  if (process.env.NODE_ENV === 'production') return;

  await Promise.all(
    DEFAULT_USERS.map(async (user) => {
      const existingUser = await User.findOne({ email: user.email }).select('+password');

      if (!existingUser) {
        await User.create(user);
        return;
      }

      const matchesDefaultPassword = await existingUser.matchPassword(user.password);
      if (!matchesDefaultPassword) {
        existingUser.password = user.password;
        await existingUser.save();
      }
    })
  );
};

/**
 * @desc    Login user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    const requestedRole = role === 'guest' ? 'user' : role;
    if (requestedRole && requestedRole !== user.role) {
      return next(new AppError(`This account is registered as a ${user.role === 'user' ? 'guest' : user.role}. Choose the correct sign-in role.`, 403));
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

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return next(new AppError('Username, email, and password are required', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('An account with this email already exists', 409));
    }

    const userRole = ['user', 'host'].includes(role) ? role : 'user';
    const user = await User.create({ username, email, password, role: userRole });

    res.status(201).json({
      status: 'success',
      token: generateToken(user._id),
      user: { _id: user._id, username: user.username, email: user.email, role: user.role },
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

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, 'username email role createdAt').sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'host', 'admin'].includes(role)) {
      return next(new AppError('Invalid user role', 400));
    }
    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      return next(new AppError('You cannot remove your own administrator role', 400));
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true }).select('username email role createdAt');
    if (!user) return next(new AppError('User not found', 404));
    res.status(200).json({ status: 'success', data: user });
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

    const seededUsers = await Promise.all(
      DEFAULT_USERS.map(async (user) => {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) return existingUser;

        return User.create(user);
      })
    );

    res.status(201).json({ status: 'success', data: seededUsers });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, registerUser, seedUsers, getMe, getUsers, updateUserRole, ensureDefaultUsers, DEFAULT_USERS };
