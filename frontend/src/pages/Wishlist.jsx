import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import {
  FiHeart,
  FiShoppingBag,
  FiTrash2,
  FiArrowRight,
  FiStar
} from 'react-icons/fi';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto text-3xl">
          <FiHeart />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Your Wishlist is Empty</h2>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          Save your favorite products here so you can easily review and purchase them later.
        </p>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all"
          >
            <span>Explore Products</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
          <p className="text-xs text-slate-500 mt-0.5">{wishlist.length} saved products</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => {
          const price = product.discountPrice > 0 ? product.discountPrice : product.price;
          const originalPrice = product.discountPrice > 0 ? product.price : null;

          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div className="relative aspect-square bg-slate-100">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-rose-600 hover:bg-rose-50 flex items-center justify-center shadow-sm"
                  title="Remove from wishlist"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">
                    {product.brand}
                  </span>
                  <Link
                    to={`/products/${product._id}`}
                    className="text-xs font-bold text-slate-800 hover:text-teal-600 line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-1 my-1">
                    <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-600">
                      {product.rating?.toFixed(1) || '4.5'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-slate-900">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    {originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => moveToCart(product)}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FiShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
