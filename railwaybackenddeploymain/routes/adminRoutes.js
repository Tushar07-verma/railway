/**
 * T-RAYO Admin Operations Routes (Passwordless / Direct Admin Access)
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Direct access routes without password requirement
router.get('/dashboard-stats', adminController.getDashboardStats);
router.post('/products', adminController.createProductAdmin);
router.put('/products/:id', adminController.updateProductAdmin);
router.delete('/products/:id', adminController.deleteProductAdmin);
router.get('/orders', adminController.getAdminOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;
