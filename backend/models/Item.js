const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    dailyPrice: {
      type: Number,
      required: [true, 'Please add a daily price'],
      min: [0, 'Daily price must be positive'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      default: [],
    },
    condition: {
      type: String,
      required: [true, 'Please specify the item condition'],
      enum: ['New', 'Like New', 'Good', 'Fair'],
    },
    isApproved: {
      type: Boolean,
      default: true, 
    }
  },
  {
    timestamps: true,
  }
);

itemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);
