// User controller: profile management, address book, password change, and admin user/role operations
const User = require('../models/userModel');

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    if (req.body.avatar) user.avatar = req.body.avatar;

    if (req.body.mobileNumber && req.body.mobileNumber !== user.mobileNumber) {
      user.mobileNumber = req.body.mobileNumber;
      user.isMobileVerified = false;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        mobileNumber: updatedUser.mobileNumber,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        isEmailVerified: updatedUser.isEmailVerified,
        isMobileVerified: updatedUser.isMobileVerified,
        addresses: updatedUser.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const { name, phone, street, city, state, postalCode, country, isDefault } = req.body;

    if (!name || !phone || !street || !city || !state || !postalCode) {
      return res.status(400).json({ success: false, message: 'Please fill all required address fields' });
    }

    const user = await User.findById(req.user._id);

    if (isDefault) user.addresses.forEach(addr => (addr.isDefault = false));

    user.addresses.push({
      name, phone, street, city, state, postalCode,
      country: country || 'India',
      isDefault: user.addresses.length === 0 ? true : Boolean(isDefault)
    });

    await user.save();
    res.status(201).json({ success: true, message: 'Address added successfully', data: user.addresses });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ success: true, message: 'Address deleted successfully', data: user.addresses });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { mobileNumber: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.role) query.role = req.query.role;

    const count = await User.countDocuments(query);
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.json({ success: true, data: users, pagination: { page, limit, total: count, pages: Math.ceil(count / limit) } });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role value' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ success: true, message: `User role updated to ${role}`, data: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile, changePassword, addAddress, deleteAddress, getAllUsers, updateUserRole, deleteUser };
