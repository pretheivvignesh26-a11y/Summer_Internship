const { check, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const bookingValidator = [
  check('bookingDate')
    .notEmpty()
    .withMessage('Booking start date is required')
    .isISO8601()
    .withMessage('Invalid start date format'),
  check('returnDate')
    .notEmpty()
    .withMessage('Return date is required')
    .isISO8601()
    .withMessage('Invalid return date format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.bookingDate)) {
        throw new Error('Return date must be after the booking start date');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, errors.array()[0].msg));
    }
    next();
  },
];

module.exports = {
  bookingValidator,
};
