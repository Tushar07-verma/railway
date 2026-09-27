/**
 * T-RAYO Inventory Routes (Passwordless Direct Access)
 */
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/:productId', inventoryController.getInventoryByProduct);
router.patch('/update-stock', inventoryController.updateStock);

module.exports = router;
