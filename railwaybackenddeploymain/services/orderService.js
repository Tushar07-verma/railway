/**
 * T-RAYO Order Service
 */
const Order = require('../models/Order');
const { getPaginationParams, formatPaginationMeta } = require('../utils/pagination');

class OrderService {
  async createOrder(userId, orderPayload) {
    const orderNumber = `TR-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = new Order({
      ...orderPayload,
      orderNumber,
      userId
    });
    return newOrder.save();
  }

  async getUserOrders(userId, queryParams) {
    const { page, limit, skip } = getPaginationParams(queryParams);
    const [orders, total] = await Promise.all([
      Order.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ userId })
    ]);

    return {
      orders,
      pagination: formatPaginationMeta(total, page, limit)
    };
  }
}

module.exports = new OrderService();
