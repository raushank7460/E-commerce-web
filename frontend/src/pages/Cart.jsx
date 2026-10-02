import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiArrowRight,
  FiShield,
  FiTruck,
  FiTag
} from 'react-icons/fi';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    tax,
    shippingFee,
    totalAmount
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-3xl">
          <FiShoppingBag />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Your Cart is Empty</h2>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          Looks like you haven't added any items to your shopping cart yet.
        </p>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all"
          >
            <span>Start Shopping</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Clear Cart */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-0.5">{cartItems.length} unique items in your cart</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                />
                <div className="space-y-1">
                  <Link
                    to={`/products/${item._id}`}
                    className="text-sm font-extrabold text-slate-800 hover:text-teal-600 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs font-bold text-slate-900">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                  {item.stock && item.stock <= 5 && (
                    <p className="text-[10px] font-bold text-amber-600">Only {item.stock} left in stock</p>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-2 text-slate-600 hover:text-slate-900"
                    title="Decrease Quantity"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-extrabold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-2 text-slate-600 hover:text-slate-900"
                    disabled={item.stock && item.quantity >= item.stock}
                    title="Increase Quantity"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <p className="text-sm font-black text-slate-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove from Cart"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Delivery Note */}
          <div className="p-4 bg-teal-50/60 border border-teal-200/60 rounded-2xl flex items-center gap-3 text-xs text-teal-900 font-medium">
            <FiTruck className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <span>
              {subtotal > 999
                ? 'Your order qualifies for FREE Express Shipping across India!'
                : `Add ₹${(999 - subtotal).toLocaleString('en-IN')} more to unlock FREE Express Delivery!`}
            </span>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-sm sticky top-24">
          <h2 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>Promotional Discount (5%)</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax (GST 18%)</span>
              <span className="font-bold text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span className="font-bold text-slate-900">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase">Free</span>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900">Total</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Proceed to Checkout</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-2">
            <FiShield className="w-4 h-4 text-emerald-500" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
