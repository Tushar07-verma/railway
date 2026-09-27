/**
 * T-RAYO Order Controller
 */
const orderService = require('../services/orderService');
const ApiResponse = require('../utils/apiResponse');

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    return ApiResponse.success(res, order, 'Order created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const result = await orderService.getUserOrders(req.user.id, req.query);
    return ApiResponse.success(res, result.orders, 'Orders retrieved', 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders
};
