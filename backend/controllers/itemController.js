const Item = require('../models/Item');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');

const createListing = async (req, res, next) => {
  try {
    const { title, description, category, dailyPrice, location, condition } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(new ApiError(404, 'Selected category does not exist'));
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (isCloudinaryConfigured()) {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'item_images',
            });
            imageUrls.push(result.secure_url);
            fs.unlinkSync(file.path);
          } catch (cloudinaryErr) {
            console.error('Cloudinary item image upload error:', cloudinaryErr);
            imageUrls.push(`/uploads/${file.filename}`);
          }
        } else {
          imageUrls.push(`/uploads/${file.filename}`);
        }
      }
    }

    const item = await Item.create({
      owner: req.user.id,
      title,
      description,
      category,
      dailyPrice: parseFloat(dailyPrice),
      location,
      condition,
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      message: 'Rental item listed successfully',
      item,
    });
  } catch (error) {
    next(error);
  }
};

const editListing = async (req, res, next) => {
  try {
    const { title, description, category, dailyPrice, location, condition, availability } = req.body;

    let item = await Item.findById(req.params.id);
    if (!item) {
      return next(new ApiError(404, 'Listing not found'));
    }

    if (item.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ApiError(403, 'Not authorized to edit this listing'));
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return next(new ApiError(404, 'Selected category does not exist'));
      }
      item.category = category;
    }

    if (title) item.title = title;
    if (description) item.description = description;
    if (dailyPrice) item.dailyPrice = parseFloat(dailyPrice);
    if (location) item.location = location;
    if (condition) item.condition = condition;
    if (availability !== undefined) item.availability = availability === 'true' || availability === true;

    if (req.files && req.files.length > 0) {
      let newImageUrls = [];
      for (const file of req.files) {
        if (isCloudinaryConfigured()) {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'item_images',
            });
            newImageUrls.push(result.secure_url);
            fs.unlinkSync(file.path);
          } catch (cloudinaryErr) {
            newImageUrls.push(`/uploads/${file.filename}`);
          }
        } else {
          newImageUrls.push(`/uploads/${file.filename}`);
        }
      }
      
      item.images = newImageUrls;
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      item,
    });
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return next(new ApiError(404, 'Listing not found'));
    }

    if (item.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ApiError(403, 'Not authorized to delete this listing'));
    }

    item.images.forEach((imgUrl) => {
      if (imgUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '../public', imgUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getAllListings = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, condition, sortBy, page, limit } = req.query;

    const query = {};

    query.availability = true;

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (condition) {
      query.condition = condition;
    }

    if (minPrice || maxPrice) {
      query.dailyPrice = {};
      if (minPrice) query.dailyPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.dailyPrice.$lte = parseFloat(maxPrice);
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skipNum = (pageNum - 1) * limitNum;

    let sortQuery = { createdAt: -1 }; 
    if (sortBy === 'price_asc') {
      sortQuery = { dailyPrice: 1 };
    } else if (sortBy === 'price_desc') {
      sortQuery = { dailyPrice: -1 };
    } else if (sortBy === 'oldest') {
      sortQuery = { createdAt: 1 };
    }

    const items = await Item.find(query)
      .populate('category', 'name')
      .populate('owner', 'name profileImage')
      .sort(sortQuery)
      .skip(skipNum)
      .limit(limitNum);

    const total = await Item.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      totalItems: total,
      items,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleListing = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('category', 'name')
      .populate('owner', 'name email phone profileImage');

    if (!item) {
      return next(new ApiError(404, 'Item listing not found'));
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createListing,
  editListing,
  deleteListing,
  getAllListings,
  getSingleListing,
};
