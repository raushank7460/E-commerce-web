import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  FiShoppingBag,
  FiClock,
  FiUser,
  FiMapPin,
  FiCheckCircle,
  FiChevronDown
} from 'react-icons/fi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter
        ? `/api/orders?status=${encodeURIComponent(statusFilter)}&limit=50`
        : '/api/orders?limit=50';
      const res = await api.get(url);
      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/api/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status updated by administrator to ${newStatus}`
      });
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const statuses = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Orders Fulfillment Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch, track shipments, and update customer order states
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-bold">Filter status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="">All Orders</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
          No orders match this status.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Order Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-bold text-white">#{order._id.substring(order._id.length - 8)}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{order.user?.name || order.shippingAddress?.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{order.user?.email || order.shippingAddress?.phone}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-xs">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{order.items?.length} Items</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {order.items?.map((i) => i.name).join(', ')}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-black text-white text-sm">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-300 block">{order.paymentMethod}</span>
                      <span
                        className={`text-[10px] font-bold ${
                          order.isPaid ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {order.isPaid ? '● Paid' : '○ Pending'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        disabled={updatingId === order._id}
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-rose-950/70 text-rose-300 border border-rose-800'
                            : 'bg-slate-800 text-teal-300 border border-slate-700'
                        }`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
