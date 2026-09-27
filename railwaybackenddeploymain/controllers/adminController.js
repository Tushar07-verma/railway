/**
 * T-RAYO Admin Controller (Zero-Password / Direct Access Mode)
 * High-performance backend controller for administrative actions
 */
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiResponse = require('../utils/apiResponse');
const versionManager = (() => {
  try { return require('../sync/version/versionManager'); }
  catch(e) { return require('../../sync/version/versionManager'); }
})();

const getDashboardStats = async (req, res, next) => {
  try {
    const [totalProducts, totalOrders, outOfStockCount] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ availability: 'OUT_OF_STOCK' })
    ]);

    return ApiResponse.success(res, {
      totalProducts,
      totalOrders,
      outOfStockCount,
      syncVersion: versionManager.getGlobalVersion().v
    }, 'Admin metrics loaded');
  } catch (error) {
    next(error);
  }
};

const createProductAdmin = async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    versionManager.bumpVersion('products');
    return ApiResponse.success(res, saved, 'Product created and global sync dispatched', 201);
  } catch (error) {
    next(error);
  }
};

const updateProductAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    versionManager.bumpVersion('products');
    return ApiResponse.success(res, updated, 'Product updated and global sync dispatched');
  } catch (error) {
    next(error);
  }
};

const deleteProductAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    versionManager.bumpVersion('products');
    return ApiResponse.success(res, { id }, 'Product deleted and global sync dispatched');
  } catch (error) {
    next(error);
  }
};

const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50).lean();
    return ApiResponse.success(res, orders, 'All orders retrieved');
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return ApiResponse.error(res, 'Order not found', 404);
    versionManager.bumpVersion('orders');
    return ApiResponse.success(res, order, 'Order status updated');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  getAdminOrders,
  updateOrderStatus
};
