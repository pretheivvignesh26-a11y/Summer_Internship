const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ item: 1, user: 1 }, { unique: true });

reviewSchema.statics.getAverageRating = async function (itemId) {
  const obj = await this.aggregate([
    {
      $match: { item: itemId },
    },
    {
      $group: {
        _id: '$item',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      await mongoose.model('Item').findByIdAndUpdate(itemId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10,
      });
    } else {
      await mongoose.model('Item').findByIdAndUpdate(itemId, {
        averageRating: undefined,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

reviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.item);
});

reviewSchema.post('remove', function () {
  this.constructor.getAverageRating(this.item);
});

module.exports = mongoose.model('Review', reviewSchema);
