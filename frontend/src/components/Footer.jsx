import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTruck, FiShield, FiRotateCcw, FiHeadphones, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-slate-200">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0">
              <FiTruck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400">On all prepaid orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400">Stripe & Razorpay encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0">
              <FiRotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Easy 7-Day Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free instant refund</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0">
              <FiHeadphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 AI & Helpdesk</h4>
              <p className="text-xs text-slate-400">Instant shopping assistance</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shadow-md">
                <FiShoppingBag className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                NEXUS<span className="text-teal-400">STORE</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
              Next-generation MERN E-Commerce platform engineered with AI recommendations, intelligent search, and secure multi-channel OTP verification.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All systems operational &bull; Built with React & Node.js
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Top Categories
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?category=Electronics" className="hover:text-teal-400 transition-colors">
                  Electronics & Audio
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-teal-400 transition-colors">
                  Fashion & Footwear
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home+%26+Kitchen" className="hover:text-teal-400 transition-colors">
                  Home & Appliances
                </Link>
              </li>
              <li>
                <Link to="/products?category=Sports+%26+Fitness" className="hover:text-teal-400 transition-colors">
                  Sports & Fitness
                </Link>
              </li>
              <li>
                <Link to="/products?category=Beauty+%26+Personal+Care" className="hover:text-teal-400 transition-colors">
                  Beauty & Fragrances
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Customer Area
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/profile" className="hover:text-teal-400 transition-colors">
                  Account Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-teal-400 transition-colors">
                  Track Your Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-teal-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-teal-400 transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-teal-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Stay in Touch
            </h5>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe for exclusive flash sales, discounts, and tech arrivals.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter email..."
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-l-lg focus:outline-none focus:border-teal-500 text-white placeholder-slate-500"
              />
              <button
                type="button"
                className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-r-lg text-xs font-bold transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} NexusStore Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Accepting UPI, RuPay, Visa, Mastercard & COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
