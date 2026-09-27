/**
 * T-RAYO Inventory Service
 */
const Inventory = require('../models/Inventory');
const versionManager = (() => {
  try { return require('../sync/version/versionManager'); }
  catch(e) { return require('../../sync/version/versionManager'); }
})();

class InventoryService {
  async getStockForProduct(productId) {
    return Inventory.find({ productId }).lean();
  }

  async updateVariantStock(productId, sku, quantityAvailable) {
    const updated = await Inventory.findOneAndUpdate(
      { productId, sku },
      { quantityAvailable },
      { new: true, upsert: true }
    );
    versionManager.bumpVersion('inventory');
    return updated;
  }
}

module.exports = new InventoryService();
