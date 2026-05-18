const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getOrders,
    updateOrderToDelivered,
} = require('../controllers/orderController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, superAdmin, getOrders);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, superAdmin, updateOrderToPaid);
router.route('/:id/deliver').put(protect, superAdmin, updateOrderToDelivered);

module.exports = router;
