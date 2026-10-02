const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const trackingHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Online Payment'],
      required: true,
      default: 'Cash on Delivery'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    paymentDetails: {
      id: String,
      status: String,
      updateTime: String,
      emailAddress: String
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
      ],
      default: 'Confirmed'
    },
    trackingHistory: [trackingHistorySchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0.0
    },
    discount: {
      type: Number,
      required: true,
      default: 0.0
    },
    tax: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0.0
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    paidAt: {
      type: Date
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false
    },
    deliveredAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
