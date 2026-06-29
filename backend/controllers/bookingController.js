const Booking = require('../models/Booking');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');

const getDaysBetween = (start, end) => {
  const diffTime = Math.abs(new Date(end) - new Date(start));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; 
};

const bookItem = async (req, res, next) => {
  try {
    const { itemId, bookingDate, returnDate } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return next(new ApiError(404, 'Rental item not found'));
    }

    if (!item.availability) {
      return next(new ApiError(400, 'This item is currently not available for rent'));
    }

    if (item.owner.toString() === req.user.id) {
      return next(new ApiError(400, 'You cannot rent your own item'));
    }

    const days = getDaysBetween(bookingDate, returnDate);
    const totalPrice = days * item.dailyPrice;

    const conflict = await Booking.findOne({
      item: itemId,
      status: 'Approved',
      $or: [
        { bookingDate: { $lte: new Date(returnDate) }, returnDate: { $gte: new Date(bookingDate) } },
      ],
    });

    if (conflict) {
      return next(new ApiError(400, 'This item is already booked for the selected dates'));
    }

    const booking = await Booking.create({
      item: itemId,
      owner: item.owner,
      renter: req.user.id,
      bookingDate: new Date(bookingDate),
      returnDate: new Date(returnDate),
      totalPrice,
    });

    await Notification.create({
      user: item.owner,
      title: 'New Booking Request',
      message: `${req.user.name} wants to rent your item "${item.title}" from ${new Date(bookingDate).toLocaleDateString()} to ${new Date(returnDate).toLocaleDateString()}.`,
    });

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('item');
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    if (booking.renter.toString() !== req.user.id && booking.owner.toString() !== req.user.id) {
      return next(new ApiError(403, 'Not authorized to cancel this booking'));
    }

    if (booking.status === 'Completed' || booking.status === 'Rejected') {
      return next(new ApiError(400, `Cannot cancel booking in '${booking.status}' status`));
    }

    booking.status = 'Cancelled';
    await booking.save();

    const notifier = req.user.id === booking.renter.toString() ? booking.owner : booking.renter;
    const cancelledBy = req.user.id === booking.renter.toString() ? 'renter' : 'owner';

    await Notification.create({
      user: notifier,
      title: 'Booking Cancelled',
      message: `The booking for "${booking.item ? booking.item.title : 'Item'}" has been cancelled by the ${cancelledBy}.`,
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

const viewBookingHistory = async (req, res, next) => {
  try {
    const role = req.query.role; 

    let query = {};
    if (role === 'owner') {
      query.owner = req.user.id;
    } else if (role === 'renter') {
      query.renter = req.user.id;
    } else {
      
      query = { $or: [{ renter: req.user.id }, { owner: req.user.id }] };
    }

    const bookings = await Booking.find(query)
      .populate('item', 'title images dailyPrice location')
      .populate('renter', 'name email phone')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

const approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('item');
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    if (booking.owner.toString() !== req.user.id) {
      return next(new ApiError(403, 'Only the item owner can approve this booking'));
    }

    if (booking.status !== 'Pending') {
      return next(new ApiError(400, `Booking status is currently '${booking.status}'. Cannot approve.`));
    }

    booking.status = 'Approved';
    booking.paymentStatus = 'Paid'; 
    await booking.save();

    await Notification.create({
      user: booking.renter,
      title: 'Booking Request Approved',
      message: `Great news! The owner approved your booking request for "${booking.item.title}".`,
    });

    res.status(200).json({
      success: true,
      message: 'Booking approved successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('item');
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    if (booking.owner.toString() !== req.user.id) {
      return next(new ApiError(403, 'Only the item owner can reject this booking'));
    }

    if (booking.status !== 'Pending') {
      return next(new ApiError(400, `Booking status is currently '${booking.status}'. Cannot reject.`));
    }

    booking.status = 'Rejected';
    await booking.save();

    await Notification.create({
      user: booking.renter,
      title: 'Booking Request Rejected',
      message: `Unfortunately, the owner declined your booking request for "${booking.item.title}".`,
    });

    res.status(200).json({
      success: true,
      message: 'Booking request rejected successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookItem,
  cancelBooking,
  viewBookingHistory,
  approveBooking,
  rejectBooking,
};
