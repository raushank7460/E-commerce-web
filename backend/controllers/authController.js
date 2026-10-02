// Auth controller: handles register, login, OTP send/verify, and current user retrieval
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { sendOtp, verifyOtp } = require('../utils/sendOtp');

const register = async (req, res, next) => {
  try {
    const { name, email, password, mobileNumber, username } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'A user with this email address already exists' });
    }

    const cleanUsername = username ? username.trim().toLowerCase() : email.split('@')[0];

    const user = await User.create({
      name,
      username: cleanUsername,
      email: email.toLowerCase(),
      password,
      mobileNumber: mobileNumber || '',
      role: 'customer'
    });

    let emailOtp = '';
    let mobileOtp = '';

    try {
      emailOtp = await sendOtp(user.email, 'email');
      if (user.mobileNumber) mobileOtp = await sendOtp(user.mobileNumber, 'mobile');
    } catch (otpErr) {
      console.error('Error generating initial OTPs:', otpErr.message);
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully! Please verify your email and mobile number.',
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified,
        token,
        devOtp: { emailOtp, mobileOtp }
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { loginIdentifier, email, password } = req.body;
    const identifier = (loginIdentifier || email || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/username/mobile and password' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }, { mobileNumber: identifier }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const sendEmailOtp = async (req, res, next) => {
  try {
    const email = req.user ? req.user.email : req.body.email;
    if (!email) return res.status(400).json({ success: false, message: 'Email address is required' });

    const otp = await sendOtp(email, 'email');
    res.json({ success: true, message: `Verification code sent to ${email}`, data: { email, devOtp: otp } });
  } catch (error) {
    next(error);
  }
};

const verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const targetEmail = (req.user ? req.user.email : email || '').trim().toLowerCase();

    if (!targetEmail || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and 6-digit OTP' });
    }

    const isValid = await verifyOtp(targetEmail, 'email', otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please request a new one.' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: targetEmail },
      { isEmailVerified: true },
      { new: true }
    ).select('-password');

    res.json({ success: true, message: 'Email verified successfully!', data: updatedUser });
  } catch (error) {
    next(error);
  }
};

const sendMobileOtp = async (req, res, next) => {
  try {
    let mobile = req.body.mobileNumber;
    if (!mobile && req.user && req.user.mobileNumber) mobile = req.user.mobileNumber;

    if (!mobile) return res.status(400).json({ success: false, message: 'Mobile number is required' });

    const otp = await sendOtp(mobile, 'mobile');
    res.json({ success: true, message: `SMS Verification code sent to ${mobile}`, data: { mobileNumber: mobile, devOtp: otp } });
  } catch (error) {
    next(error);
  }
};

const verifyMobileOtp = async (req, res, next) => {
  try {
    const { mobileNumber, otp } = req.body;
    let targetMobile = (mobileNumber || (req.user && req.user.mobileNumber) || '').trim();

    if (!targetMobile || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide mobile number and 6-digit OTP' });
    }

    const isValid = await verifyOtp(targetMobile, 'mobile', otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please request a new one.' });
    }

    let updatedUser;
    if (req.user) {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { mobileNumber: targetMobile, isMobileVerified: true },
        { new: true }
      ).select('-password');
    } else {
      updatedUser = await User.findOneAndUpdate(
        { mobileNumber: targetMobile },
        { isMobileVerified: true },
        { new: true }
      ).select('-password');
    }

    res.json({ success: true, message: 'Mobile number verified successfully!', data: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, sendEmailOtp, verifyEmailOtp, sendMobileOtp, verifyMobileOtp };
