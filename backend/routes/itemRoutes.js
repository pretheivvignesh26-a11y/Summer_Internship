const express = require('express');
const router = express.Router();
const {
  createListing,
  editListing,
  deleteListing,
  getAllListings,
  getSingleListing,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const { uploadArray } = require('../middleware/uploadMiddleware');
const { itemValidator } = require('../validators/itemValidator');

router.post('/', protect, uploadArray, itemValidator, createListing);
router.put('/:id', protect, uploadArray, editListing);
router.delete('/:id', protect, deleteListing);
router.get('/', getAllListings);
router.get('/:id', getSingleListing);

module.exports = router;
