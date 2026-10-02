const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(addToWishlist);

router.post('/move-to-cart', moveToCart);
router.delete('/:productId', removeFromWishlist);

module.exports = router;
