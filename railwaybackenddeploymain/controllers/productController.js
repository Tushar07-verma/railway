/**
 * T-RAYO Product Controller
 */
const productService = require('../services/productService');
const ApiResponse = require('../utils/apiResponse');

const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getClothingProducts(req.query);
    return ApiResponse.success(res, result.products, 'Products retrieved successfully', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    return ApiResponse.success(res, product, 'Product details retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById
};
