const express = require('express');
const router = express.Router();
const {
  bookItem,
  cancelBooking,
  viewBookingHistory,
  approveBooking,
  rejectBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { bookingValidator } = require('../validators/bookingValidator');

router.post('/', protect, bookingValidator, bookItem);
router.patch('/:id/cancel', protect, cancelBooking);
router.get('/', protect, viewBookingHistory);
router.patch('/:id/approve', protect, approveBooking);
router.patch('/:id/reject', protect, rejectBooking);

module.exports = router;
