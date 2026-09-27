/**
 * T-RAYO Centralized Inventory SKU Model
 */
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    variant: {
      size: { type: String, required: true },
      color: { type: String, required: true }
    },
    quantityAvailable: { type: Number, required: true, min: 0 },
    quantityReserved: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
