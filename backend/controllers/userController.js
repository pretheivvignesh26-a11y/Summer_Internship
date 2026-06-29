const User = require('../models/User');
const Item = require('../models/Item');
const Booking = require('../models/Booking');
const Wishlist = require('../models/Wishlist');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
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

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, 'Please upload an image file'));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    let imageUrl = '';

    if (isCloudinaryConfigured()) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile_images',
          width: 150,
          height: 150,
          crop: 'fill',
        });
        imageUrl = result.secure_url;
        
        fs.unlinkSync(req.file.path);
      } catch (cloudinaryErr) {
        console.error('Cloudinary upload error:', cloudinaryErr);
        
        imageUrl = `/uploads/${req.file.filename}`;
      }
    } else {
      
      imageUrl = `/uploads/${req.file.filename}`;
    }

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      profileImage: imageUrl,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    await Item.deleteMany({ owner: req.user.id });

    await Booking.deleteMany({
      $or: [{ renter: req.user.id }, { owner: req.user.id }],
    });

    await Wishlist.findOneAndDelete({ user: req.user.id });

    await User.findByIdAndDelete(req.user.id);

    res.clearCookie('refreshToken');
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully. We will miss you!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteAccount,
};
