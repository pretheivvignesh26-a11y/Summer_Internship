const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError(409, 'User already exists with this email'));
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    await Wishlist.create({ user: user._id, items: [] });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const maxAge = rememberMe 
      ? 30 * 24 * 60 * 60 * 1000 
      : 7 * 24 * 60 * 60 * 1000; 

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAge,
    });

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }

    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return next(new ApiError(401, 'Refresh token missing'));
    }

    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return next(new ApiError(403, 'Invalid refresh token'));
    }

    try {
      jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_12345!'
      );
      
      const accessToken = generateAccessToken(user);
      res.status(200).json({ success: true, accessToken });
    } catch (err) {
      return next(new ApiError(403, 'Invalid or expired refresh token'));
    }
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(404, 'There is no user with that email'));
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    
    const frontendResetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${frontendResetUrl} \n\n If you did not request this, please ignore this email.`;

    const result = await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message: message,
      html: `
        <h3>Password Reset Request</h3>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${frontendResetUrl}" target="_blank">${frontendResetUrl}</a>
        <p>This link is valid for 10 minutes.</p>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully (check email/server terminal logs for link)',
      
      resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ApiError(400, 'Invalid or expired password reset token'));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
};
