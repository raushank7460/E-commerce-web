import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiBox,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiArrowUpRight
} from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/orders/admin/stats');
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: FiDollarSign,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      label: 'Registered Customers',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: 'from-purple-500 to-pink-600'
    },
    {
      label: 'Live Catalog Products',
      value: stats?.totalProducts || 0,
      icon: FiBox,
      color: 'from-amber-500 to-orange-600'
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: FiClock,
      color: 'from-amber-400 to-amber-600'
    },
    {
      label: 'Delivered Orders',
      value: stats?.deliveredOrders || 0,
      icon: FiCheckCircle,
      color: 'from-emerald-400 to-emerald-600'
    }
  ];

  const maxRevenue = Math.max(...(stats?.monthlyPerformance?.map(m => m.revenue) || [100000]));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Executive Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">Platform analytics, revenue telemetry, and order velocity</p>
      </div>

      {/* Counter Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400">{card.label}</span>
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${card.color} text-white flex items-center justify-center`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-tight">{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* Analytics & Charts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue Performance Bars */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-extrabold text-white">Monthly Revenue Performance</h2>
              <p className="text-xs text-slate-400">Total gross revenue & processed orders volume</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {stats?.monthlyPerformance?.map((item, i) => {
              const percentage = Math.max(8, Math.round((item.revenue / (maxRevenue || 1)) * 100));
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{item.month}</span>
                    <span className="text-teal-400">₹{item.revenue.toLocaleString('en-IN')} ({item.orders} orders)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-extrabold text-white">Low Stock Watch</h3>
            </div>
            <Link to="/admin/products" className="text-xs text-teal-400 font-bold hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((p) => (
                <div key={p._id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                      alt={p.name}
                      className="w-9 h-9 object-cover rounded-lg bg-slate-800 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate max-w-[130px]">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.category}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {p.stock} left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">All products are healthy in inventory!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
