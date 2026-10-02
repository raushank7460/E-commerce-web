import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  FiSearch,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiCpu,
  FiShield,
  FiCheckCircle,
  FiAlertTriangle
} from 'react-icons/fi';
import { Sparkles, Bot, ArrowRight } from 'lucide-react';

const Navbar = ({ onOpenAiAssistant }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    'All Products',
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Sports & Fitness',
    'Beauty & Personal Care'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white text-xs font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>Grand Tech Festival: Free Delivery on orders over ₹999 & Extra 5% off over ₹2,000!</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <FiShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent tracking-tight">
                  NEXUS<span className="text-slate-800">STORE</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest -mt-1">
                  MERN Premium
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Center */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-4 relative items-center"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phones, laptops, clothes, air fryers..."
                className="w-full pl-10 pr-24 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 focus:bg-white transition-all shadow-inner"
              />
              <FiSearch className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-xs font-semibold transition-all shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 border border-teal-200/80 hover:border-teal-300 hover:shadow-sm text-xs font-bold transition-all group"
              title="Open AI Shopping Assistant"
            >
              <Bot className="w-4 h-4 text-teal-600 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Wishlist"
            >
              <FiHeart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Cart"
            >
              <FiShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-teal-500 shadow-sm"
                  />
                  <span className="hidden md:inline text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {user.isEmailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                            <FiCheckCircle className="w-3 h-3 text-emerald-600" /> Email Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">
                            <FiAlertTriangle className="w-3 h-3 text-amber-600" /> Email Unverified
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <FiUser className="w-4 h-4 text-slate-400" /> My Profile & Security
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <FiShoppingBag className="w-4 h-4 text-slate-400" /> My Orders & Tracking
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50/70 hover:bg-teal-100 transition-colors"
                      >
                        <FiShield className="w-4 h-4 text-teal-600" /> Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4 text-rose-500" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm shadow-teal-600/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <div className="hidden lg:flex items-center gap-1 py-2 border-t border-slate-100 text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isAll = cat === 'All Products';
            const linkTo = isAll ? '/products' : `/products?category=${encodeURIComponent(cat)}`;
            const isActive = isAll
              ? location.pathname === '/products' && !location.search
              : location.search.includes(encodeURIComponent(cat));

            return (
              <Link
                key={cat}
                to={linkTo}
                className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'hover:bg-slate-100 hover:text-slate-900 text-slate-600'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
          </form>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Browse Categories
            </p>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={cat === 'All Products' ? '/products' : `/products?category=${encodeURIComponent(cat)}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
