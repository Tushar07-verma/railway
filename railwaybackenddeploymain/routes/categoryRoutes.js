/**
 * T-RAYO Category Routes
 */
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const cacheControl = require('../middleware/cacheMiddleware');

router.get('/', cacheControl(600), categoryController.getCategories);

module.exports = router;
