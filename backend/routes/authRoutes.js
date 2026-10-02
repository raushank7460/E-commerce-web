const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  sendEmailOtp,
  verifyEmailOtp,
  sendMobileOtp,
  verifyMobileOtp
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Email & Mobile Verification OTP routes
router.post('/send-email-otp', protect, sendEmailOtp);
router.post('/verify-email-otp', protect, verifyEmailOtp);
router.post('/send-mobile-otp', protect, sendMobileOtp);
router.post('/verify-mobile-otp', protect, verifyMobileOtp);

// Also support public verification for newly registered users before login
router.post('/public/send-email-otp', sendEmailOtp);
router.post('/public/verify-email-otp', verifyEmailOtp);
router.post('/public/send-mobile-otp', sendMobileOtp);
router.post('/public/verify-mobile-otp', verifyMobileOtp);

module.exports = router;
