import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import {
  FiArrowRight,
  FiTrendingUp,
  FiAward,
  FiZap,
  FiTag,
  FiShield,
  FiSmartphone,
  FiCheck
} from 'react-icons/fi';
import { Sparkles, Bot, ShoppingBag, Laptop, Shirt, Home as HomeIcon, Dumbbell } from 'lucide-react';

const Home = ({ onOpenAiAssistant }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, recRes] = await Promise.all([
          api.get('/api/products?limit=12'),
          api.get('/api/recommendations')
        ]);

        if (prodRes.data?.data) {
          setAllProducts(prodRes.data.data);
          setFeaturedProducts(prodRes.data.data.filter(p => p.isFeatured));
        }

        if (recRes.data?.data) {
          setRecommendations(recRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load home page products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { name: 'Electronics', icon: Laptop, color: 'from-blue-500 to-indigo-600', count: 'Laptops, Phones, Audio' },
    { name: 'Fashion', icon: Shirt, color: 'from-rose-500 to-pink-600', count: 'Footwear & Apparel' },
    { name: 'Home & Kitchen', icon: HomeIcon, color: 'from-amber-500 to-orange-600', count: 'Smart Appliances' },
    { name: 'Sports & Fitness', icon: Dumbbell, color: 'from-emerald-500 to-teal-600', count: 'Gear & Weights' }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-teal-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.25),rgba(255,255,255,0))]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
              <span>AI-DRIVEN E-COMMERCE EXPERIENCE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              Discover Quality. <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                Engineered for Life.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Explore curated premium technology, designer footwear, and smart living essentials. Powered by personalized AI recommendations and lightning-fast checkout.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="px-7 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-extrabold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all flex items-center gap-2 group"
              >
                <span>Shop Catalog</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={onOpenAiAssistant}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-bold backdrop-blur-md transition-all flex items-center gap-2 group"
              >
                <Bot className="w-4 h-4 text-teal-300 group-hover:rotate-12 transition-transform" />
                <span>Ask AI Assistant</span>
              </button>
            </div>

            {/* Micro proof points */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-lg font-black text-white">100%</p>
                <p className="text-xs text-slate-400">Authentic Brands</p>
              </div>
              <div>
                <p className="text-lg font-black text-white">Fast</p>
                <p className="text-xs text-slate-400">Pan-India Express</p>
              </div>
              <div>
                <p className="text-lg font-black text-white">24/7</p>
                <p className="text-xs text-slate-400">AI Concierge</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500 to-emerald-500 opacity-30 blur-xl"></div>
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-xs font-mono text-teal-400 font-semibold">Live Product Spotlight</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
                    alt="MacBook Pro"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <p className="text-[11px] text-teal-400 font-bold uppercase">MacBook Pro 16" M3 Max</p>
                    <p className="text-xs font-extrabold text-white">₹3,29,900</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Need shopping guidance?</p>
                    <p className="text-[11px] text-slate-400">Try our AI Assistant right now</p>
                  </div>
                  <button
                    onClick={onOpenAiAssistant}
                    className="px-3 py-1.5 bg-teal-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-teal-400 transition-colors"
                  >
                    Try Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-xs text-slate-500 mt-1">Explore our handpicked product departments</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group"
          >
            <span>All Categories</span>
            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.name}
                to={`/products?category=${encodeURIComponent(c.name)}`}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 border border-slate-200/80 hover:border-teal-500/40 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${c.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{c.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-teal-50/80 p-6 sm:p-8 rounded-3xl border border-teal-200/60 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">AI Recommended For You</h2>
                  <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full uppercase">
                    Smart Pick
                  </span>
                </div>
                <p className="text-xs text-slate-600">Personalized matching based on interests & top catalog affinities</p>
              </div>
            </div>

            <button
              onClick={onOpenAiAssistant}
              className="text-xs font-bold text-teal-800 bg-white hover:bg-teal-50 border border-teal-200 px-4 py-2 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Refine with Assistant
            </button>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recommendations.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <FiZap className="w-4 h-4" /> Top Trending
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Products</h2>
          </div>
          <Link
            to="/products?isFeatured=true"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(featuredProducts.length > 0 ? featuredProducts : allProducts).slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-8 sm:p-12 text-white border border-slate-700">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              Limited Time Special
            </span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Upgrade Your Tech & Lifestyle Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Get an instant 5% discount on all purchases above ₹2,000. Verified fast checkout, verified reviews, and hassle-free returns.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg transition-all"
              >
                <span>Browse Sale Products</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
