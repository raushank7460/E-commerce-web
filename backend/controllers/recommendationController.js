// Handles AI recommendations, natural language chatbot queries, and AI search for the shop
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Wishlist = require('../models/wishlistModel');
const User = require('../models/userModel');

const getRecommendations = async (req, res, next) => {
  try {
    let recommendedProducts = [];
    const preferredCategories = new Set();
    const excludeProductIds = new Set();

    if (req.user) {
      const userOrders = await Order.find({ user: req.user._id }).limit(5);
      userOrders.forEach(order => {
        order.items.forEach(item => {
          excludeProductIds.add(item.product.toString());
        });
      });

      const wishlist = await Wishlist.findOne({ user: req.user._id });
      if (wishlist && wishlist.products.length > 0) {
        const wishlistProducts = await Product.find({ _id: { $in: wishlist.products } });
        wishlistProducts.forEach(p => preferredCategories.add(p.category));
      }

      const user = await User.findById(req.user._id).populate('recentlyViewed');
      if (user && user.recentlyViewed) {
        user.recentlyViewed.forEach(p => {
          if (p && p.category) preferredCategories.add(p.category);
          if (p) excludeProductIds.add(p._id.toString());
        });
      }

      if (preferredCategories.size > 0) {
        recommendedProducts = await Product.find({
          category: { $in: Array.from(preferredCategories) },
          _id: { $nin: Array.from(excludeProductIds) },
          stock: { $gt: 0 }
        })
          .sort({ rating: -1, numReviews: -1 })
          .limit(8);
      }
    }

    if (recommendedProducts.length < 8) {
      const remainingCount = 8 - recommendedProducts.length;
      const supplemental = await Product.find({
        _id: {
          $nin: [
            ...Array.from(excludeProductIds),
            ...recommendedProducts.map(p => p._id.toString())
          ]
        },
        stock: { $gt: 0 }
      })
        .sort({ isFeatured: -1, rating: -1, numReviews: -1 })
        .limit(remainingCount);

      recommendedProducts = [...recommendedProducts, ...supplemental];
    }

    res.json({ success: true, message: 'AI recommendations computed', data: recommendedProducts });
  } catch (error) {
    next(error);
  }
};

const parseNaturalLanguageQuery = (queryText) => {
  const text = queryText.toLowerCase();
  const criteria = {};

  const underPriceMatch = text.match(/(?:under|below|less than|within|budget of)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
  if (underPriceMatch) {
    const priceLimit = Number(underPriceMatch[1].replace(/,/g, ''));
    if (!isNaN(priceLimit) && priceLimit > 0) criteria.maxPrice = priceLimit;
  }

  const categoryKeywords = {
    'Electronics': ['phone', 'mobile', 'smartphone', 'laptop', 'computer', 'earbuds', 'headphone', 'watch', 'smartwatch', 'tablet', 'speaker', 'tv', 'television', 'camera'],
    'Fashion': ['shirt', 't-shirt', 'hoodie', 'jacket', 'jeans', 'dress', 'clothing', 'shoes', 'running shoes', 'sneakers', 'apparel', 'wear', 'trousers', 'kurta'],
    'Home & Kitchen': ['kitchen', 'cookware', 'mixer', 'grinder', 'coffee', 'blender', 'air fryer', 'kettle', 'vacuum', 'chair', 'desk', 'lamp'],
    'Beauty & Personal Care': ['perfume', 'fragrance', 'lotion', 'cream', 'skincare', 'shampoo', 'sunscreen', 'serum', 'facewash'],
    'Sports & Fitness': ['gym', 'yoga', 'dumbbell', 'fitness', 'exercise', 'mat', 'treadmill', 'cycle', 'sports']
  };

  for (const [catName, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(k => text.includes(k))) {
      criteria.category = catName;
      break;
    }
  }

  const stopwords = ['i', 'need', 'suggest', 'show', 'me', 'a', 'an', 'the', 'good', 'best', 'for', 'under', 'below', 'less', 'than', 'find', 'which', 'has', 'products', 'with', 'in'];
  const words = text
    .replace(/[₹,?.!]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopwords.includes(w) && isNaN(w));

  criteria.keywords = words;
  return criteria;
};

const aiShoppingAssistantChat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const criteria = parseNaturalLanguageQuery(message);
    const dbQuery = { stock: { $gt: 0 } };

    if (criteria.maxPrice) dbQuery.price = { $lte: criteria.maxPrice };
    if (criteria.category) dbQuery.category = criteria.category;

    if (criteria.keywords && criteria.keywords.length > 0) {
      dbQuery.$or = criteria.keywords.map(kw => ({
        $or: [
          { name: { $regex: kw, $options: 'i' } },
          { brand: { $regex: kw, $options: 'i' } },
          { tags: { $regex: kw, $options: 'i' } },
          { description: { $regex: kw, $options: 'i' } }
        ]
      }));
    }

    let matchedProducts = await Product.find(dbQuery).sort({ rating: -1, numReviews: -1 }).limit(4);

    if (matchedProducts.length === 0 && criteria.category) {
      const relaxedQuery = { category: criteria.category, stock: { $gt: 0 } };
      if (criteria.maxPrice) relaxedQuery.price = { $lte: criteria.maxPrice * 1.25 };
      matchedProducts = await Product.find(relaxedQuery).sort({ rating: -1 }).limit(4);
    }

    if (matchedProducts.length === 0) {
      matchedProducts = await Product.find({ stock: { $gt: 0 } }).sort({ rating: -1 }).limit(3);
    }

    const qLower = message.toLowerCase();
    let replyText = '';

    if (qLower.includes('laptop') && criteria.maxPrice) {
      replyText = `Here are the top-rated laptops fitting right inside your budget under ₹${criteria.maxPrice.toLocaleString('en-IN')}. They feature fast processors, vibrant displays, and great battery life:`;
    } else if (qLower.includes('shoe') || qLower.includes('running')) {
      replyText = `I found excellent running shoes designed with responsive cushioning and breathable grip for maximum comfort:`;
    } else if (qLower.includes('camera') || qLower.includes('phone')) {
      replyText = `Based on high customer ratings and camera sensors, here are the standout choices with flagship-grade optics and performance:`;
    } else if (qLower.includes('student') || qLower.includes('college')) {
      replyText = `For college students, value, productivity, and battery life are essential. Check out these highly recommended essentials:`;
    } else if (criteria.category) {
      replyText = `Here are the top picks in ${criteria.category}${criteria.maxPrice ? ` under ₹${criteria.maxPrice.toLocaleString('en-IN')}` : ''} backed by top customer ratings:`;
    } else {
      replyText = `I analyzed your request and picked these top recommendations matching your criteria from our catalog:`;
    }

    res.json({
      success: true,
      data: {
        reply: replyText,
        products: matchedProducts,
        intent: {
          category: criteria.category || 'All',
          maxPrice: criteria.maxPrice || null,
          keywords: criteria.keywords || []
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const aiSearch = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const criteria = parseNaturalLanguageQuery(q);
    const dbQuery = {};

    if (criteria.maxPrice) dbQuery.price = { $lte: criteria.maxPrice };
    if (criteria.category) dbQuery.category = criteria.category;

    if (criteria.keywords && criteria.keywords.length > 0) {
      dbQuery.$or = criteria.keywords.map(kw => ({
        $or: [
          { name: { $regex: kw, $options: 'i' } },
          { brand: { $regex: kw, $options: 'i' } },
          { tags: { $regex: kw, $options: 'i' } },
          { description: { $regex: kw, $options: 'i' } }
        ]
      }));
    }

    const products = await Product.find(dbQuery).sort({ rating: -1, createdAt: -1 }).limit(20);

    res.json({ success: true, data: { queryParsed: criteria, products } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations, aiShoppingAssistantChat, aiSearch };
