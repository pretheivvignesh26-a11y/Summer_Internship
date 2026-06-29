const User = require('../models/User');
const Item = require('../models/Item');
const Booking = require('../models/Booking');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');

const dashboardStatistics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Item.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['Approved', 'Completed'] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    const revenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    const latestUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
    const latestBookings = await Booking.find()
      .populate('item', 'title')
      .populate('renter', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const statusAgg = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalUsers,
        totalListings,
        totalBookings,
        revenue,
        latestUsers,
        latestBookings,
        statusBreakdown: statusAgg,
      },
    });
  } catch (error) {
    next(error);
  }
};

const userManagement = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    if (user.role === 'Admin') {
      return next(new ApiError(400, 'Cannot delete an Admin account'));
    }

    await Item.deleteMany({ owner: user._id });
    await Booking.deleteMany({
      $or: [{ renter: user._id }, { owner: user._id }],
    });

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: `User "${user.name}" and all associated listings/bookings deleted by admin.`,
    });
  } catch (error) {
    next(error);
  }
};

const listingManagement = async (req, res, next) => {
  try {
    const items = await Item.find()
      .populate('category', 'name')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: items.length, items });
  } catch (error) {
    next(error);
  }
};

const bookingAnalytics = async (req, res, next) => {
  try {
    const categoryAgg = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const categoriesReport = [];
    for (const item of categoryAgg) {
      if (item._id) {
        const cat = await Category.findById(item._id);
        categoriesReport.push({
          categoryName: cat ? cat.name : 'Unknown',
          listingsCount: item.count,
        });
      }
    }

    res.status(200).json({
      success: true,
      analytics: categoriesReport,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  dashboardStatistics,
  userManagement,
  deleteUser,
  listingManagement,
  bookingAnalytics,
};
