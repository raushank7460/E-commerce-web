const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: [val => val.length > 0, 'Please provide at least one image']
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    tags: {
      type: [String],
      default: []
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    specifications: [specificationSchema],
    reviews: [reviewSchema]
  },
  {
    timestamps: true
  }
);

// Full text search index
productSchema.index({
  name: 'text',
  brand: 'text',
  category: 'text',
  tags: 'text',
  description: 'text'
});

module.exports = mongoose.model('Product', productSchema);
