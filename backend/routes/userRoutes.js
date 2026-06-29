const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.patch('/profile/image', protect, uploadSingle, uploadProfileImage);
router.delete('/profile', protect, deleteAccount);

module.exports = router;
