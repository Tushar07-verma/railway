/**
 * T-RAYO Product Catalog Routes
 */
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cacheControl = require('../middleware/cacheMiddleware');

// Fast cached catalogue search with pagination and clothing-specific query filters
router.get('/', cacheControl(120), productController.getProducts);
router.get('/:id', cacheControl(300), productController.getProductById);

module.exports = router;
