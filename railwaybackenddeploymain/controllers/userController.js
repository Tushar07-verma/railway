/**
 * T-RAYO User & Auth Controller
 */
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // Architecture structure: placeholder for registration logic
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return ApiResponse.error(res, 'Email already in use', 400);
    }
    const user = new User({ name, email, passwordHash: 'hash_placeholder' });
    await user.save();
    return ApiResponse.success(res, { userId: user._id, email: user.email }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }
    const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    return ApiResponse.success(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash').lean();
    return ApiResponse.success(res, user, 'Profile fetched');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
};
