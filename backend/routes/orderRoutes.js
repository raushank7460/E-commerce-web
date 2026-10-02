const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getAdminStats
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Admin Analytics & Dashboard stats
router.get('/admin/stats', protect, admin, getAdminStats);

// Customer order actions
router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.get('/my-orders', protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/cancel', protect, cancelOrder);

// Admin update status
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
