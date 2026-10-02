import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import {
  FiStar,
  FiShoppingBag,
  FiHeart,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiCheck,
  FiPlus,
  FiMinus,
  FiMessageSquare
} from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/products/${id}`);
        if (res.data?.data) {
          setProduct(res.data.data.product);
          setSelectedImage(res.data.data.product.images?.[0] || '');
          setRelatedProducts(res.data.data.relatedProducts || []);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-sm">The product you are looking for is unavailable.</p>
        <Link to="/products" className="inline-block px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold">
          Back to Store
        </Link>
      </div>
    );
  }

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const originalPrice = product.discountPrice > 0 ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=/products/${id}`);
      return;
    }

    setReviewSubmitting(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await api.post(`/api/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });

      setProduct(res.data.data);
      setReviewComment('');
      setReviewSuccess('Review published successfully!');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const isFavorited = isInWishlist(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb */}
      <nav className="text-xs font-medium text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-teal-600">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-teal-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Hero Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 relative shadow-inner">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-teal-600 scale-95 shadow-md'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-teal-600 uppercase tracking-widest">
                {product.brand}
              </span>
              <button
                onClick={() => addToWishlist(product)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FiHeart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-600' : ''}`} />
                <span>{isFavorited ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Reviews summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-1 rounded-lg text-xs font-bold">
                <FiStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating?.toFixed(1) || '4.5'}</span>
              </div>
              <span className="text-xs text-slate-500">
                {product.numReviews} Verified Reviews
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <FiCheck className="w-3.5 h-3.5" /> Verified Authentic
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {originalPrice && (
              <span className="text-sm font-semibold text-slate-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-extrabold text-rose-600 bg-rose-100/60 px-2 py-0.5 rounded-full">
                Save ₹{(originalPrice - price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Stock & Quantity controls */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Availability:</span>
              {product.stock > 0 ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  In Stock ({product.stock} units ready to ship)
                </span>
              ) : (
                <span className="font-bold text-rose-600">Currently Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-extrabold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-extrabold shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              <FiShoppingBag className="w-4 h-4" />
              <span>{addedToast ? 'Added to Cart!' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Buy Now</span>
            </button>
          </div>

          {/* Trust Value Banners */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <FiTruck className="w-4 h-4 text-teal-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">Free Delivery</p>
              <p className="text-[10px] text-slate-400">Over ₹999</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <FiRotateCcw className="w-4 h-4 text-teal-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">7-Day Returns</p>
              <p className="text-[10px] text-slate-400">Easy Replacement</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <FiShield className="w-4 h-4 text-teal-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">Warranty</p>
              <p className="text-[10px] text-slate-400">100% Guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && product.specifications.length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-black text-slate-900">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {product.specifications.map((spec, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-slate-100 text-xs">
                <span className="font-semibold text-slate-500">{spec.key}</span>
                <span className="font-bold text-slate-900 text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews & Form Section */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-black text-slate-900">Customer Ratings & Reviews</h3>
            <p className="text-xs text-slate-500 mt-1">Hear what other buyers think about this item</p>
          </div>
          <div className="flex items-center gap-1.5 text-base font-extrabold text-slate-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60">
            <FiStar className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{product.rating?.toFixed(1) || '0.0'} / 5</span>
          </div>
        </div>

        {/* Existing Reviews */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={rev.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-800">{rev.name}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <FiStar key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to share your experience!</p>
          )}
        </div>

        {/* Add Review Form */}
        <div className="pt-6 border-t border-slate-200">
          <h4 className="text-sm font-extrabold text-slate-900 mb-3">Leave a Review</h4>
          
          {reviewError && (
            <div className="p-3 mb-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              {reviewError}
            </div>
          )}

          {reviewSuccess && (
            <div className="p-3 mb-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200">
              {reviewSuccess}
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
                  >
                    <FiStar
                      className={`w-6 h-6 ${
                        star <= reviewRating ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Your Thoughts</label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How was the product quality, performance, and packaging?"
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={reviewSubmitting || !reviewComment.trim()}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              {reviewSubmitting ? 'Posting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Customers Also Viewed in {product.category}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
