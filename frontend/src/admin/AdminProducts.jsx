import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiX,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');

  // Product Form State
  const initialForm = {
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'Electronics',
    brand: '',
    images: '',
    stock: '',
    tags: '',
    isFeatured: false
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/products?limit=100');
      if (res.data?.data) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load products for admin', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice || '',
      category: p.category,
      brand: p.brand,
      images: p.images.join(', '),
      stock: p.stock,
      tags: p.tags?.join(', ') || '',
      isFeatured: p.isFeatured || false
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
      stock: Number(form.stock),
      images: form.images.split(',').map((img) => img.trim()).filter(Boolean),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean)
    };

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, payload);
      } else {
        await api.post('/api/products', payload);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Create CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Product Catalog Management</h1>
          <p className="text-xs text-slate-400 mt-1">Add, update inventory, and manage live products</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by title, brand, category..."
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <FiSearch className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-800 flex-shrink-0"
                    />
                    <div className="min-w-0 max-w-xs">
                      <p className="font-extrabold text-white truncate">{p.name}</p>
                      {p.isFeatured && (
                        <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">
                          ★ Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-400">{p.category}</td>
                  <td className="py-3 px-4 font-bold text-slate-300">{p.brand}</td>
                  <td className="py-3 px-4 font-bold text-white">
                    ₹{p.price.toLocaleString('en-IN')}
                    {p.discountPrice > 0 && (
                      <span className="text-[10px] text-teal-400 block">
                        ₹{p.discountPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock > 10
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : p.stock > 0
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4 text-amber-400 font-bold">
                    ★ {p.rating?.toFixed(1) || '0.0'} ({p.numReviews})
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-rose-400 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-extrabold text-white">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Image URLs (comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="https://... , https://..."
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Search Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="laptop, gaming, dell, portable"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-500"
                />
                <label htmlFor="featuredCheck" className="font-bold text-slate-300 cursor-pointer">
                  Feature this product on homepage carousel
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl"
                >
                  {editingProduct ? 'Save Updates' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
