const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ApiError(401, 'Not authorized, token missing'));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || 'fallback_access_secret_12345!'
      );
      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return next(new ApiError(404, 'User not found associated with this token'));
      }
      next();
    } catch (err) {
      return next(new ApiError(401, 'Not authorized, token expired or invalid'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
