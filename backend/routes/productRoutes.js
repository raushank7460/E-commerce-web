const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategoriesAndBrands
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Metadata route (must be before /:id)
router.get('/meta/categories-brands', getCategoriesAndBrands);

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
  .post(protect, createProductReview);

module.exports = router;
