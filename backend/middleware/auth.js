const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../models/User');

/**
 * Verify JWT token and attach user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized, no token', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);

    if (!req.user) {
      return next(new AppError('User not found', 401));
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired, please log in again', 401));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    }
    next(new AppError('Not authorized', 401));
  }
};

/**
 * Restrict access to hosts and admins only
 */
const requireHost = (req, res, next) => {
  if (req.user.role !== 'host' && req.user.role !== 'admin') {
    return next(new AppError('Access denied. Host privileges required.', 403));
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Access denied. Administrator privileges required.', 403));
  }
  next();
};

module.exports = { authMiddleware, requireHost, requireAdmin };
