const express = require('express');
const router = express.Router();
const {
  dashboardStatistics,
  userManagement,
  deleteUser,
  listingManagement,
  bookingAnalytics,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router.get('/statistics', dashboardStatistics);
router.get('/users', userManagement);
router.delete('/users/:id', deleteUser);
router.get('/listings', listingManagement);
router.get('/analytics/bookings', bookingAnalytics);

module.exports = router;
