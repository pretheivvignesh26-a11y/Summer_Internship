const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;
