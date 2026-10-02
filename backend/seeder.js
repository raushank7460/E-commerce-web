const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const Cart = require('./models/cartModel');
const Wishlist = require('./models/wishlistModel');
const Otp = require('./models/otpModel');

dotenv.config();

const sampleProducts = [
  {
    name: 'MacBook Pro 16" M3 Max',
    description: 'Apple MacBook Pro 16-inch with M3 Max chip (16-core CPU, 40-core GPU, 36GB Unified Memory, 1TB SSD Storage) in Space Black. Liquid Retina XDR display with ProMotion technology.',
    price: 349900,
    discountPrice: 329900,
    category: 'Electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 15,
    rating: 4.9,
    numReviews: 24,
    tags: ['laptop', 'apple', 'macbook', 'm3', 'pro', 'computer'],
    isFeatured: true,
    specifications: [
      { key: 'Processor', value: 'Apple M3 Max 16-Core' },
      { key: 'RAM', value: '36GB Unified Memory' },
      { key: 'Storage', value: '1TB Superfast SSD' },
      { key: 'Display', value: '16.2-inch Liquid Retina XDR 120Hz' }
    ]
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    description: 'Industry-leading noise canceling with two processors and 8 microphones. Magnificent sound quality engineered to perfection with High-Resolution Audio and up to 30-hour battery life.',
    price: 34990,
    discountPrice: 28990,
    category: 'Electronics',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 35,
    rating: 4.8,
    numReviews: 42,
    tags: ['headphone', 'sony', 'wireless', 'noise-cancelling', 'audio'],
    isFeatured: true,
    specifications: [
      { key: 'Battery Life', value: 'Up to 30 Hours with Fast Charge' },
      { key: 'Driver Unit', value: '30mm Carbon Fiber Composite' },
      { key: 'Connectivity', value: 'Bluetooth 5.2, Multipoint' }
    ]
  },
  {
    name: 'Samsung Galaxy S24 Ultra 5G',
    description: 'Titanium Gray, 12GB RAM, 256GB Storage. Galaxy AI features with Circle to Search, Live Translate, and Note Assist. 200MP Quad-tele camera system with Snapdragon 8 Gen 3.',
    price: 129999,
    discountPrice: 119999,
    category: 'Electronics',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 22,
    rating: 4.7,
    numReviews: 58,
    tags: ['phone', 'mobile', 'samsung', 'galaxy', 's24', 'flagship', 'ai'],
    isFeatured: true,
    specifications: [
      { key: 'Display', value: '6.8-inch Dynamic AMOLED 2X 120Hz' },
      { key: 'Camera', value: '200MP Main + 50MP Periscope + 12MP Ultra-wide' },
      { key: 'Battery', value: '5000 mAh with 45W Fast Charging' }
    ]
  },
  {
    name: 'Dell XPS 15 9530 Core i7 RTX 4060',
    description: '15.6" OLED 3.5K Touch Display, 13th Gen Intel Core i7-13700H, 16GB DDR5, 1TB SSD, NVIDIA GeForce RTX 4060 8GB GDDR6, CNC Aluminum chassis with Platinum Silver.',
    price: 219900,
    discountPrice: 194900,
    category: 'Electronics',
    brand: 'Dell',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 8,
    rating: 4.6,
    numReviews: 18,
    tags: ['laptop', 'dell', 'xps', 'gaming', 'editing', 'rtx4060'],
    isFeatured: false,
    specifications: [
      { key: 'Graphics', value: 'NVIDIA GeForce RTX 4060 8GB' },
      { key: 'Screen', value: '3.5K OLED 400-nit InfinityEdge' }
    ]
  },
  {
    name: 'Nike Air Zoom Pegasus 40 Running Shoes',
    description: 'A springy ride for any run with Nike React foam technology and two Zoom Air units in the forefoot and heel. Lightweight, breathable engineered mesh upper with secure midfoot band.',
    price: 11895,
    discountPrice: 9495,
    category: 'Fashion',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 45,
    rating: 4.8,
    numReviews: 89,
    tags: ['shoes', 'running', 'nike', 'pegasus', 'sneakers', 'sports'],
    isFeatured: true,
    specifications: [
      { key: 'Closure', value: 'Lace-Up' },
      { key: 'Sole Material', value: 'Durable Rubber Waffle Pattern' },
      { key: 'Weight', value: '288g (Men size 9)' }
    ]
  },
  {
    name: 'Levi\'s Men\'s 511 Slim Fit Stretch Jeans',
    description: 'A modern slim with room to move. The 511 Slim Fit Jeans are an everyday classic cut close through the thigh with a slim leg opening. Crafted with Levi\'s Flex sustainable stretch denim.',
    price: 3999,
    discountPrice: 2499,
    category: 'Fashion',
    brand: 'Levi\'s',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 60,
    rating: 4.5,
    numReviews: 120,
    tags: ['jeans', 'levis', 'fashion', 'denim', 'clothing', 'men'],
    isFeatured: false,
    specifications: [
      { key: 'Fabric', value: '99% Cotton, 1% Elastane' },
      { key: 'Fit', value: 'Slim fit through seat and thigh' }
    ]
  },
  {
    name: 'Philips Digital Air Fryer XL (4.2L)',
    description: 'Rapid Air technology for healthy frying with up to 90% less fat. Touch screen with 7 presets, keep warm function, and dishwasher safe parts. 1400W energy efficient performance.',
    price: 11995,
    discountPrice: 8499,
    category: 'Home & Kitchen',
    brand: 'Philips',
    images: [
      'https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 25,
    rating: 4.6,
    numReviews: 64,
    tags: ['air fryer', 'kitchen', 'philips', 'cooking', 'home appliance'],
    isFeatured: true,
    specifications: [
      { key: 'Capacity', value: '4.2 Liters' },
      { key: 'Power', value: '1400 Watts' },
      { key: 'Warranty', value: '2 Years Manufacturer Warranty' }
    ]
  },
  {
    name: 'Nespresso Vertuo Pop Coffee Machine',
    description: 'Innovative Centrifusion extraction system to brew authentic espresso, double espresso, gran lungo, and large mugs at the touch of a button with velvety crema.',
    price: 18990,
    discountPrice: 14990,
    category: 'Home & Kitchen',
    brand: 'Nespresso',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 18,
    rating: 4.7,
    numReviews: 31,
    tags: ['coffee', 'espresso', 'nespresso', 'kitchen', 'appliances'],
    isFeatured: false,
    specifications: [
      { key: 'Water Tank', value: '600 ml Removable' },
      { key: 'Heat-up Time', value: '30 seconds fast heat-up' }
    ]
  },
  {
    name: 'Bowflex SelectTech 552 Adjustable Dumbbells (Pair)',
    description: 'Adjusts from 2 to 24 kg per dumbbell with the turn of a dial. Combines 15 sets of weights into one compact, quiet system with durable molding around metal plates.',
    price: 36990,
    discountPrice: 31990,
    category: 'Sports & Fitness',
    brand: 'Bowflex',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 12,
    rating: 4.9,
    numReviews: 47,
    tags: ['gym', 'fitness', 'dumbbell', 'workout', 'weights', 'exercise'],
    isFeatured: true,
    specifications: [
      { key: 'Weight Range', value: '2.5 to 24 kg per dumbbell' },
      { key: 'Increments', value: '15 weight settings' }
    ]
  },
  {
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm',
    description: 'Rugged titanium case with precision dual-frequency GPS, up to 36 hours of battery life, customized Action button, and 3000-nit Always-On Retina display with Oceanic+ app support.',
    price: 89900,
    discountPrice: 84900,
    category: 'Electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 9,
    rating: 4.9,
    numReviews: 36,
    tags: ['watch', 'smartwatch', 'apple', 'ultra', 'fitness', 'titanium'],
    isFeatured: true,
    specifications: [
      { key: 'Case', value: '49mm Aerospace-grade Titanium' },
      { key: 'Water Resistance', value: '100m water resistant' }
    ]
  },
  {
    name: 'Chanel Bleu De Chanel Eau de Parfum (100ml)',
    description: 'An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail. A timeless scent housed in an enigmatic blue bottle.',
    price: 15400,
    discountPrice: 13900,
    category: 'Beauty & Personal Care',
    brand: 'Chanel',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 28,
    rating: 4.8,
    numReviews: 53,
    tags: ['perfume', 'fragrance', 'chanel', 'luxury', 'beauty'],
    isFeatured: false,
    specifications: [
      { key: 'Volume', value: '100 ml / 3.4 FL. OZ.' },
      { key: 'Concentration', value: 'Eau de Parfum' }
    ]
  },
  {
    name: 'Sony PlayStation 5 Slim Console (Disc Edition)',
    description: 'Experience lightning fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.',
    price: 54990,
    discountPrice: 49990,
    category: 'Electronics',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 14,
    rating: 4.9,
    numReviews: 142,
    tags: ['gaming', 'ps5', 'sony', 'playstation', 'console'],
    isFeatured: true,
    specifications: [
      { key: 'Storage', value: '1TB Custom SSD' },
      { key: 'Resolution', value: 'Up to 4K 120Hz with HDR' }
    ]
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';
    await mongoose.connect(mongoUri);
    console.log(' Connected to MongoDB for seeding...');

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Otp.deleteMany();

    console.log(' Cleared old database collections.');

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin Boss',
      username: 'admin',
      email: 'admin@store.com',
      mobileNumber: '+919876543210',
      password: 'Admin@123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      isEmailVerified: true,
      isMobileVerified: true,
      addresses: [
        {
          name: 'Admin HQ',
          phone: '+919876543210',
          street: '100 Innovation Boulevard, Tech Park',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560100',
          country: 'India',
          isDefault: true
        }
      ]
    });

    // Create Customer User
    const customerUser = await User.create({
      name: 'Raushan Kumar',
      username: 'raushan',
      email: 'user@store.com',
      mobileNumber: '+919812345678',
      password: 'User@123',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isEmailVerified: true,
      isMobileVerified: true,
      addresses: [
        {
          name: 'Raushan Kumar',
          phone: '+919812345678',
          street: '42 Lakeview Towers, Cyber City',
          city: 'Gurugram',
          state: 'Haryana',
          postalCode: '122002',
          country: 'India',
          isDefault: true
        }
      ]
    });

    console.log(` Created Admin: admin@store.com (Pass: Admin@123)`);
    console.log(` Created Customer: user@store.com (Pass: User@123)`);

    // Insert sample products with attached reviews
    const productsWithReviews = sampleProducts.map(p => ({
      ...p,
      reviews: [
        {
          user: customerUser._id,
          name: 'Raushan Kumar',
          rating: p.rating,
          comment: `Absolutely loved this ${p.name}! Superb build quality and fast delivery.`,
          avatar: customerUser.avatar,
          createdAt: new Date()
        }
      ]
    }));

    const insertedProducts = await Product.insertMany(productsWithReviews);
    console.log(` Inserted ${insertedProducts.length} high-quality products.`);

    // Create an initial sample completed order for user to test analytics & order history
    const sampleOrder = await Order.create({
      user: customerUser._id,
      items: [
        {
          product: insertedProducts[0]._id,
          name: insertedProducts[0].name,
          image: insertedProducts[0].images[0],
          price: insertedProducts[0].discountPrice || insertedProducts[0].price,
          quantity: 1
        }
      ],
      shippingAddress: customerUser.addresses[0],
      paymentMethod: 'Online Payment',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      subtotal: insertedProducts[0].discountPrice || insertedProducts[0].price,
      discount: 0,
      tax: 59382,
      shippingFee: 0,
      totalAmount: (insertedProducts[0].discountPrice || insertedProducts[0].price) + 59382,
      isPaid: true,
      paidAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      isDelivered: true,
      deliveredAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      trackingHistory: [
        { status: 'Confirmed', message: 'Order placed and paid online.', timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000) },
        { status: 'Shipped', message: 'Handed over to courier partner.', timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000) },
        { status: 'Delivered', message: 'Package delivered at customer doorstep.', timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000) }
      ]
    });

    console.log(` Seeded sample order ${sampleOrder._id} for Raushan.`);

    console.log('\n Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
