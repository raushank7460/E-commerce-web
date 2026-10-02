import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiHeart, FiShoppingBag, FiStar, FiCheck } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist } = useWishlist();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const originalPrice = product.discountPrice > 0 ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };

  const isFavorited = isInWishlist(product._id);
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
  const hoverImage = product.images?.[1] || mainImage;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-teal-500/30 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Wrapper */}
      <Link to={`/products/${product._id}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-md scale-110'
              : 'bg-white/80 backdrop-blur-md text-slate-500 hover:text-rose-600 hover:bg-white shadow-sm'
          }`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <FiHeart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Low Stock Warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            Only {product.stock} left!
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-teal-700">{product.brand}</span>
            <span className="text-slate-400">{product.category}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product._id}`}
            className="font-bold text-sm text-slate-800 line-clamp-2 hover:text-teal-600 transition-colors mb-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-xs font-bold">
              <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating?.toFixed(1) || '4.5'}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.numReviews || 0} reviews)</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-slate-900">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              addedAnimation
                ? 'bg-emerald-600 text-white scale-95'
                : product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white border border-teal-200/60'
            }`}
          >
            {addedAnimation ? (
              <>
                <FiCheck className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <FiShoppingBag className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
