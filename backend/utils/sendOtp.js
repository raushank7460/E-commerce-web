const Otp = require('../models/otpModel');

// Generate a random 6-digit OTP
const generateNumericOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate and store OTP in database
 * @param {string} identifier - Email address or mobile number
 * @param {'email'|'mobile'} type - Channel type
 * @returns {Promise<string>} Generated OTP
 */
const sendOtp = async (identifier, type) => {
  const cleanIdentifier = identifier.trim().toLowerCase();
  
  // Delete any existing OTPs for this identifier and type
  await Otp.deleteMany({ identifier: cleanIdentifier, type });

  const otp = generateNumericOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await Otp.create({
    identifier: cleanIdentifier,
    otp,
    type,
    expiresAt
  });

  // Log prominently for development / instant testing
  console.log(`\n======================================================`);
  console.log(` [OTP DISPATCH] Type: ${type.toUpperCase()}`);
  console.log(` Target: ${cleanIdentifier}`);
  console.log(` Generated OTP: ${otp} (Valid for 10 minutes)`);
  console.log(`======================================================\n`);

  // In production, integrate Nodemailer for email and Twilio/SMS gateway for mobile
  return otp;
};

/**
 * Verify OTP entered by user
 * @param {string} identifier - Email address or mobile number
 * @param {'email'|'mobile'} type - Channel type
 * @param {string} otp - The 6-digit OTP submitted
 * @returns {Promise<boolean>}
 */
const verifyOtp = async (identifier, type, otp) => {
  const cleanIdentifier = identifier.trim().toLowerCase();
  
  const record = await Otp.findOne({
    identifier: cleanIdentifier,
    type,
    otp: otp.trim()
  });

  if (!record) {
    return false;
  }

  if (new Date() > record.expiresAt) {
    await Otp.deleteOne({ _id: record._id });
    return false;
  }

  // Once verified, delete the OTP record
  await Otp.deleteOne({ _id: record._id });
  return true;
};

module.exports = {
  generateNumericOtp,
  sendOtp,
  verifyOtp
};
