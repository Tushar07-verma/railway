/**
 * T-RAYO Inventory Controller
 */
const inventoryService = require('../services/inventoryService');
const ApiResponse = require('../utils/apiResponse');

const getInventoryByProduct = async (req, res, next) => {
  try {
    const stock = await inventoryService.getStockForProduct(req.params.productId);
    return ApiResponse.success(res, stock, 'Inventory fetched');
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { productId, sku, quantityAvailable } = req.body;
    const updated = await inventoryService.updateVariantStock(productId, sku, quantityAvailable);
    return ApiResponse.success(res, updated, 'Stock updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventoryByProduct,
  updateStock
};
