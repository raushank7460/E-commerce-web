// Product controller: CRUD operations, reviews, category/brand metadata, and recently viewed tracking
const Product = require('../models/productModel');
const User = require('../models/userModel');

const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const query = {};

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    if (req.query.category && req.query.category !== 'All') {
      const categories = req.query.category.split(',').map(c => c.trim());
      query.category = { $in: categories };
    }

    if (req.query.brand) {
      const brands = req.query.brand.split(',').map(b => b.trim());
      query.brand = { $in: brands };
    }

    if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.rating) query.rating = { $gte: Number(req.query.rating) };
    if (req.query.inStock === 'true') query.stock = { $gt: 0 };
    if (req.query.isFeatured === 'true') query.isFeatured = true;

    let sortOptions = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'priceAsc': sortOptions = { price: 1 }; break;
        case 'priceDesc': sortOptions = { price: -1 }; break;
        case 'newest': sortOptions = { createdAt: -1 }; break;
        case 'mostPopular': sortOptions = { numReviews: -1, rating: -1 }; break;
        case 'highestRated': sortOptions = { rating: -1 }; break;
        default: sortOptions = { createdAt: -1 };
      }
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit);

    res.json({ success: true, data: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { recentlyViewed: product._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { recentlyViewed: { $each: [product._id], $position: 0, $slice: 10 } }
      });
    }

    const relatedProducts = await Product.find({ category: product.category, _id: { $ne: product._id } })
      .limit(4)
      .select('name price discountPrice images rating numReviews category');

    res.json({ success: true, data: { product, relatedProducts } });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, category, brand, images, stock, tags, isFeatured, specifications } = req.body;

    if (!name || !price || !category || !brand || !images || images.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields including at least one image' });
    }

    const product = new Product({
      name,
      description: description || 'Premium product designed with high quality materials.',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      category,
      brand,
      images: Array.isArray(images) ? images : [images],
      stock: Number(stock) || 0,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      isFeatured: Boolean(isFeatured),
      specifications: specifications || []
    });

    const savedProduct = await product.save();
    res.status(201).json({ success: true, message: 'Product created successfully', data: savedProduct });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const fields = ['name', 'description', 'price', 'discountPrice', 'category', 'brand', 'images', 'stock', 'tags', 'isFeatured', 'specifications'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    const updatedProduct = await product.save();
    res.json({ success: true, message: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};

const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id, avatar: req.user.avatar };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added successfully', data: product });
  } catch (error) {
    next(error);
  }
};

const getCategoriesAndBrands = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');
    res.json({ success: true, data: { categories, brands } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getCategoriesAndBrands };
