const jwt = require('jsonwebtoken');

const generateToken = (id, role = 'customer') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecretjwtkey_ecommerce_2025_prod_secure',
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;
