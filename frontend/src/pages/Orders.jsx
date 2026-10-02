import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  FiShoppingBag,
  FiClock,
  FiArrowRight,
  FiXCircle,
  FiCheckCircle,
  FiTruck
} from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/orders/my-orders');
      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/api/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      Pending: 'bg-amber-50 text-amber-700 border-amber-200',
      Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
      Processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      Shipped: 'bg-teal-50 text-teal-700 border-teal-200',
      'Out for Delivery': 'bg-purple-50 text-purple-700 border-purple-200',
      Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return map[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-3xl">
          <FiShoppingBag />
        </div>
        <h2 className="text-2xl font-black text-slate-800">No Orders Placed Yet</h2>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          You haven't made any purchases yet. Explore our latest arrivals!
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Order History</h1>
        <p className="text-xs text-slate-500 mt-0.5">Track packages, view receipts, and monitor deliveries</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

          return (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
            >
              {/* Order Meta Header */}
              <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <span className="text-slate-400 font-medium block">Order Placed</span>
                    <span className="font-bold text-slate-800">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Total Amount</span>
                    <span className="font-black text-slate-900">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Ship To</span>
                    <span className="font-bold text-slate-800">
                      {order.shippingAddress?.name || 'Customer'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <span>Track Order</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 sm:p-6 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Quantity: {item.quantity} &bull; ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Cancel Action if applicable */}
                {canCancel && (
                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <FiXCircle className="w-3.5 h-3.5" />
                      <span>Cancel Order</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
