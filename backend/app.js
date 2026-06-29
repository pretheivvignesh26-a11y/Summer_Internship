require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const Category = require('./models/Category');
const logger = require('./utils/logger');
const { configureCloudinary } = require('./config/cloudinary');

const app = express();

connectDB().then(async () => {
  
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      const defaultCategories = [
        { name: 'Electronics', description: 'Gadgets, cameras, laptops, and more' },
        { name: 'Vehicles', description: 'Cars, bikes, bicycles, and scooters' },
        { name: 'Tools & Equipment', description: 'Drills, saws, ladders, and building gear' },
        { name: 'Home Appliances', description: 'Vacuum cleaners, microwaves, and blenders' },
        { name: 'Outdoor & Camping', description: 'Tents, hiking bags, and camping tools' },
        { name: 'Books & Education', description: 'Textbooks, novels, and reference guides' }
      ];
      await Category.insertMany(defaultCategories);
      logger.info('Default categories seeded successfully.');
    }
  } catch (err) {
    logger.error('Failed to seed categories:', err);
  }
});

configureCloudinary();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet({
  crossOriginResourcePolicy: false, 
}));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200, 
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/categories', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
});

app.get('/api/wishlist', require('./middleware/authMiddleware').protect, async (req, res, next) => {
  try {
    const Wishlist = require('./models/Wishlist');
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: 'items',
      populate: { path: 'category owner', select: 'name' }
    });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] });
    }
    res.status(200).json({ success: true, wishlist: wishlist.items });
  } catch (error) {
    next(error);
  }
});

app.post('/api/wishlist/toggle', require('./middleware/authMiddleware').protect, async (req, res, next) => {
  try {
    const { itemId } = req.body;
    const Wishlist = require('./models/Wishlist');
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] });
    }

    const index = wishlist.items.indexOf(itemId);
    let added = false;
    if (index === -1) {
      wishlist.items.push(itemId);
      added = true;
    } else {
      wishlist.items.splice(index, 1);
    }
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: added ? 'Added to wishlist' : 'Removed from wishlist',
      added,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/notifications', require('./middleware/authMiddleware').protect, async (req, res, next) => {
  try {
    const Notification = require('./models/Notification');
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/notifications/:id/read', require('./middleware/authMiddleware').protect, async (req, res, next) => {
  try {
    const Notification = require('./models/Notification');
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/notifications/read-all', require('./middleware/authMiddleware').protect, async (req, res, next) => {
  try {
    const Notification = require('./models/Notification');
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
