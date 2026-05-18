const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, superAdmin, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, superAdmin, updateProduct)
    .delete(protect, superAdmin, deleteProduct);

module.exports = router;
