const Review = require('../models/Review');
const Item = require('../models/Item');
const ApiError = require('../utils/ApiError');

const addReview = async (req, res, next) => {
  try {
    const { itemId, rating, comment } = req.body;

    const itemExists = await Item.findById(itemId);
    if (!itemExists) {
      return next(new ApiError(404, 'Listing item not found'));
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user.id,
      item: itemId,
    });

    if (alreadyReviewed) {
      return next(new ApiError(400, 'You have already reviewed this item'));
    }

    const review = await Review.create({
      user: req.user.id,
      item: itemId,
      rating: parseInt(rating, 10),
      comment,
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

const editReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ApiError(404, 'Review not found'));
    }

    if (review.user.toString() !== req.user.id) {
      return next(new ApiError(403, 'Not authorized to edit this review'));
    }

    if (rating) review.rating = parseInt(rating, 10);
    if (comment) review.comment = comment;

    await review.save();

    await Review.getAverageRating(review.item);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ApiError(404, 'Review not found'));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ApiError(403, 'Not authorized to delete this review'));
    }

    const itemId = review.item;
    await Review.findByIdAndDelete(req.params.id);

    await Review.getAverageRating(itemId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ item: req.params.itemId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  editReview,
  deleteReview,
  getReviews,
};
