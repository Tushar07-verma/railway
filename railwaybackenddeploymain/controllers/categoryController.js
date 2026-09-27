/**
 * T-RAYO Category Controller
 */
const Category = require('../models/Category');
const ApiResponse = require('../utils/apiResponse');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
    return ApiResponse.success(res, categories, 'Categories retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories
};
