// Cart controller: get, add, update quantity, remove items, and clear cart with tax/shipping totals
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const calculateCartTotals = (items) => {
  const subtotal = items.reduce((acc, item) => {
    const itemPrice = item.product?.discountPrice && item.product.discountPrice > 0
      ? item.product.discountPrice
      : item.product?.price || item.price || 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const discount = subtotal > 2000 ? Math.round(subtotal * 0.05) : 0;
  const totalAmount = Math.max(0, subtotal - discount + tax + shippingFee);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shippingFee,
    tax,
    discount,
    totalAmount: Math.round(totalAmount * 100) / 100
  };
};

const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discountPrice images stock brand category'
    });

    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const totals = calculateCartTotals(cart.items);
    res.json({ success: true, data: { items: cart.items, ...totals } });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingIndex = cart.items.findIndex(item => item.product.toString() === productId);
    const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
      cart.items[existingIndex].price = price;
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), price });
    }

    await cart.save();

    cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discountPrice images stock brand category'
    });

    const totals = calculateCartTotals(cart.items);
    res.json({ success: true, message: 'Product added to cart', data: { items: cart.items, ...totals } });
  } catch (error) {
    next(error);
  }
};

const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} units available` });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discountPrice images stock brand category'
    });

    const totals = calculateCartTotals(populatedCart.items);
    res.json({ success: true, message: 'Cart updated', data: { items: populatedCart.items, ...totals } });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discountPrice images stock brand category'
    });

    const totals = calculateCartTotals(populatedCart.items);
    res.json({ success: true, message: 'Item removed from cart', data: { items: populatedCart.items, ...totals } });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) { cart.items = []; await cart.save(); }

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: { items: [], subtotal: 0, shippingFee: 0, tax: 0, discount: 0, totalAmount: 0 }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItemQuantity, removeFromCart, clearCart };
