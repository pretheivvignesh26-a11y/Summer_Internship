const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET || 'fallback_access_secret_12345!',
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_12345!',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
