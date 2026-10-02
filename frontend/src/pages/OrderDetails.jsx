import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiPackage,
  FiMapPin,
  FiArrowLeft,
  FiCheck
} from 'react-icons/fi';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/orders/${id}`);
        if (res.data?.data) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/orders" className="text-xs font-bold text-teal-600">
          Back to Orders
        </Link>
      </div>
    );
  }

  const stages = ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStageIndex = stages.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">Order #{order._id}</span>
      </div>

      {/* Visual Tracking Progress Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900">Shipment Status</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking and status updates from fulfillment center
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isCancelled
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-teal-50 text-teal-700 border border-teal-200'
            }`}
          >
            {order.orderStatus}
          </span>
        </div>

        {isCancelled ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs">
            This order was cancelled. Any pre-payments will be processed to the original payment source.
          </div>
        ) : (
          <div className="relative pt-4 pb-2">
            <div className="flex items-center justify-between relative z-10">
              {stages.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stage} className="flex flex-col items-center text-center max-w-[80px]">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                          : 'bg-slate-200 text-slate-500'
                      } ${isCurrent ? 'ring-4 ring-teal-100' : ''}`}
                    >
                      {isPassed ? <FiCheck className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-2 font-bold ${
                        isPassed ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Background Line */}
            <div className="absolute top-8 left-6 right-6 h-1 bg-slate-200 -z-0">
              <div
                className="h-full bg-teal-600 transition-all duration-500"
                style={{
                  width: `${Math.max(0, (currentStageIndex / (stages.length - 1)) * 100)}%`
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Tracking Activity Log */}
        {order.trackingHistory && order.trackingHistory.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Activity History
            </h4>
            <div className="space-y-2">
              {order.trackingHistory.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <span className="font-bold text-slate-800">{item.status}: </span>
                    <span className="text-slate-600">{item.message}</span>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Items & Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Items List */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Ordered Products
          </h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div>
                    <Link
                      to={`/products/${item.product}`}
                      className="font-bold text-slate-800 hover:text-teal-600 line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-slate-400 mt-0.5">
                      Qty: {item.quantity} &bull; ₹{item.price.toLocaleString('en-IN')} each
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs text-xs">
          <div>
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-2">
              Delivery Address
            </h4>
            <p className="font-bold text-slate-800">{order.shippingAddress?.name}</p>
            <p className="text-slate-600 mt-1 leading-relaxed">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
            </p>
            <p className="text-slate-500 mt-1">📞 {order.shippingAddress?.phone}</p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-2">
              Payment Information
            </h4>
            <p className="text-slate-600">Method: <strong className="text-slate-800">{order.paymentMethod}</strong></p>
            <p className="text-slate-600 mt-1">
              Status:{' '}
              <strong className={order.isPaid ? 'text-emerald-600' : 'text-amber-600'}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </strong>
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-2">
              Payment Breakdown
            </h4>
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount:</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Tax (GST 18%):</span>
              <span>₹{order.tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping:</span>
              <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
              <span>Total Paid:</span>
              <span className="text-teal-700">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
