const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  addAddress,
  deleteAddress,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Customer profile & addresses
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/change-password', protect, changePassword);

router.route('/addresses')
  .post(protect, addAddress);

router.delete('/addresses/:addressId', protect, deleteAddress);

// Admin user management
router.route('/')
  .get(protect, admin, getAllUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser);

router.route('/:id/role')
  .put(protect, admin, updateUserRole);

module.exports = router;
