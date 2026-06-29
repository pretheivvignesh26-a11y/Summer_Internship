const express = require('express');
const router = express.Router();
const {
  addReview,
  editReview,
  deleteReview,
  getReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addReview);
router.put('/:id', protect, editReview);
router.delete('/:id', protect, deleteReview);
router.get('/item/:itemId', getReviews);

module.exports = router;
