// Wishlist controller: get, add, remove products, and move items directly to cart
const Wishlist = require('../models/wishlistModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name price discountPrice images stock brand category rating numReviews'
    });

    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    res.json({ success: true, data: wishlist.products });
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name price discountPrice images stock brand category rating numReviews'
    });

    res.json({ success: true, message: 'Product added to wishlist', data: wishlist.products });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();

    wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name price discountPrice images stock brand category rating numReviews'
    });

    res.json({ success: true, message: 'Product removed from wishlist', data: wishlist.products });
  } catch (error) {
    next(error);
  }
};

const moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    const existingIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1, price });
    }
    await cart.save();

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
      await wishlist.save();
    }

    const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name price discountPrice images stock brand category rating numReviews'
    });

    res.json({ success: true, message: 'Product moved to cart successfully', data: { wishlist: updatedWishlist ? updatedWishlist.products : [] } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, moveToCart };
