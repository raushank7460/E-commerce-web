import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import {
  FiCheck,
  FiMapPin,
  FiCreditCard,
  FiDollarSign,
  FiArrowRight,
  FiArrowLeft,
  FiPlus,
  FiAlertCircle
} from 'react-icons/fi';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, subtotal, discount, tax, shippingFee, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [newAddressFormOpen, setNewAddressFormOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state for adding an address
  const [addrForm, setAddrForm] = useState({
    name: user?.name || '',
    phone: user?.mobileNumber || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const addresses = user?.addresses || [];

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/users/addresses', addrForm);
      if (res.data?.data) {
        user.addresses = res.data.data;
        setSelectedAddressIndex(res.data.data.length - 1);
        setNewAddressFormOpen(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    const selectedAddress = addresses[selectedAddressIndex] || addrForm;

    if (!selectedAddress || !selectedAddress.street) {
      setError('Please select or specify a valid delivery address');
      setStep(1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          name: selectedAddress.name || user.name,
          phone: selectedAddress.phone || user.mobileNumber || '9999999999',
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country || 'India'
        },
        paymentMethod,
        subtotal,
        discount,
        tax,
        shippingFee,
        totalAmount
      };

      const res = await api.post('/api/orders', orderPayload);
      if (res.data?.data) {
        await clearCart();
        navigate(`/orders/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Checkout Step Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between max-w-md mx-auto relative z-10">
          {[
            { num: 1, label: 'Delivery Address' },
            { num: 2, label: 'Order Review' },
            { num: 3, label: 'Payment' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <button
                onClick={() => s.num < step && setStep(s.num)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s.num
                    ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-md'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s.num ? <FiCheck className="w-5 h-5" /> : s.num}
              </button>
              <span className="text-[11px] font-bold text-slate-700 mt-2">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-5 left-1/4 right-1/4 h-0.5 bg-slate-200 -z-0"></div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Select or Add Address */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Delivery Address</h2>
              <p className="text-xs text-slate-500">Select where you want your products delivered</p>
            </div>
            <button
              onClick={() => setNewAddressFormOpen(!newAddressFormOpen)}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Existing Addresses */}
          {addresses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr, idx) => (
                <div
                  key={addr._id || idx}
                  onClick={() => setSelectedAddressIndex(idx)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedAddressIndex === idx
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">{addr.name}</span>
                    {selectedAddressIndex === idx && (
                      <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">
                        Deliver Here
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">📞 {addr.phone}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add New Address Form Modal/Inline */}
          {(newAddressFormOpen || addresses.length === 0) && (
            <form onSubmit={handleAddNewAddress} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                {addresses.length === 0 ? 'Enter Delivery Address' : 'New Address Details'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={addrForm.name}
                  onChange={(e) => setAddrForm({ ...addrForm, name: e.target.value })}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={addrForm.phone}
                  onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Street / House Number / Landmark"
                  value={addrForm.street}
                  onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                  className="col-span-1 sm:col-span-2 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={addrForm.city}
                  onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={addrForm.state}
                  onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Postal Code / PIN"
                  value={addrForm.postalCode}
                  onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {addresses.length > 0 && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
                >
                  Save Address
                </button>
              )}
            </form>
          )}

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-2"
            >
              <span>Continue to Summary</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Order Summary Review */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-xl font-extrabold text-slate-900">Order Summary</h2>
            <p className="text-xs text-slate-500">Review your products and charges before payment</p>
          </div>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                    <p className="text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>Discount:</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Tax (GST 18%):</span>
              <span className="font-bold text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping:</span>
              <span className="font-bold text-slate-900">
                {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
              <span>Total Payable:</span>
              <span className="text-teal-700 text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-2"
            >
              <span>Proceed to Payment</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Payment Method */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-xl font-extrabold text-slate-900">Choose Payment Method</h2>
            <p className="text-xs text-slate-500">Fast, secure payment processing</p>
          </div>

          <div className="space-y-3">
            {/* Cash on Delivery */}
            <label
              onClick={() => setPaymentMethod('Cash on Delivery')}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'Cash on Delivery'
                  ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-600/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <FiDollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</h4>
                  <p className="text-xs text-slate-500">Pay cash or scan QR when your shipment arrives</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={() => setPaymentMethod('Cash on Delivery')}
                className="text-teal-600 focus:ring-teal-500"
              />
            </label>

            {/* Online Payment (Stripe / Razorpay Architecture) */}
            <label
              onClick={() => setPaymentMethod('Online Payment')}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'Online Payment'
                  ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-600/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <FiCreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Online Payment</h4>
                  <p className="text-xs text-slate-500">UPI, Cards, NetBanking (Stripe / Razorpay-ready gateway)</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Online Payment'}
                onChange={() => setPaymentMethod('Online Payment')}
                className="text-teal-600 focus:ring-teal-500"
              />
            </label>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2"
            >
              {loading ? 'Processing Order...' : `Place Order (₹${totalAmount.toLocaleString('en-IN')})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
