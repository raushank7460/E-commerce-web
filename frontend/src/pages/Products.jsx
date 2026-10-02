import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import {
  FiFilter,
  FiGrid,
  FiList,
  FiX,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiSliders
} from 'react-icons/fi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ categories: [], brands: [] });
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isListView, setIsListView] = useState(false);

  // Filter states
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const inStock = searchParams.get('inStock') === 'true';
  const page = Number(searchParams.get('page')) || 1;

  // Local state for price inputs
  const [priceInput, setPriceInput] = useState({ min: minPrice, max: maxPrice });

  // Load distinct categories & brands
  useEffect(() => {
    api.get('/api/products/meta/categories-brands')
      .then(res => {
        if (res.data?.data) {
          setMeta(res.data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(searchParams);
        const res = await api.get(`/api/products?${queryParams.toString()}`);
        if (res.data?.data) {
          setProducts(res.data.data);
          setPagination(res.data.pagination || { page: 1, limit: 12, total: res.data.data.length, pages: 1 });
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === '' || value === null || value === undefined) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (priceInput.min) newParams.set('minPrice', priceInput.min);
    else newParams.delete('minPrice');

    if (priceInput.max) newParams.set('maxPrice', priceInput.max);
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceInput({ min: '', max: '' });
  };

  const hasActiveFilters = Boolean(
    search || category || brand || minPrice || maxPrice || rating || inStock
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header & Breadcrumb / Sort controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {category ? `${category}` : search ? `Search results for "${search}"` : 'All Products'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} of {pagination.total} items
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-xs"
          >
            <FiFilter className="w-4 h-4 text-teal-600" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            )}
          </button>

          {/* Grid / List switch */}
          <div className="hidden sm:flex items-center border border-slate-200 rounded-xl p-0.5 bg-white">
            <button
              onClick={() => setIsListView(false)}
              className={`p-1.5 rounded-lg transition-colors ${
                !isListView ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsListView(true)}
              className={`p-1.5 rounded-lg transition-colors ${
                isListView ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List View"
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-semibold hidden sm:inline">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="mostPopular">Most Popular</option>
              <option value="highestRated">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FiSliders className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-extrabold text-slate-900">Filters</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Categories</h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => updateParam('category', '')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  !category ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Categories
              </button>
              {meta.categories.map((c) => (
                <button
                  key={c}
                  onClick={() => updateParam('category', c)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === c ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Brands</h3>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {meta.brands.map((b) => (
                <label key={b} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-teal-600">
                  <input
                    type="checkbox"
                    checked={brand === b}
                    onChange={(e) => updateParam('brand', e.target.checked ? b : '')}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Price Range (₹)</h3>
            <form onSubmit={handlePriceFilter} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceInput.min}
                  onChange={(e) => setPriceInput({ ...priceInput, min: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <span className="text-xs text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceInput.max}
                  onChange={(e) => setPriceInput({ ...priceInput, max: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-800 hover:text-teal-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors"
              >
                Apply Range
              </button>
            </form>
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Customer Rating</h3>
            <div className="space-y-1.5">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => updateParam('rating', rating === String(stars) ? '' : String(stars))}
                  className={`flex items-center gap-1.5 w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    rating === String(stars) ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: stars }).map((_, i) => (
                      <FiStar key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span>{stars}★ & above</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="pt-4 border-t border-slate-200">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>In-Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid / List Display */}
        <main className="lg:col-span-3">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                <FiSearch />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800">No products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters, broadening your price range, or searching for alternative keywords.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                isListView
                  ? 'space-y-4'
                  : 'grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'
              }
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Navigation */}
          {pagination.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => updateParam('page', page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.pages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateParam('page', pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                      page === pageNum
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => updateParam('page', page + 1)}
                disabled={page >= pagination.pages}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl ml-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-extrabold text-base text-slate-900">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Same category filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Category</h4>
              {meta.categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    updateParam('category', c);
                    setMobileFilterOpen(false);
                  }}
                  className={`block w-full text-left py-1 text-xs ${
                    category === c ? 'font-bold text-teal-600' : 'text-slate-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                clearAllFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
