const { check, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const itemValidator = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters')
    .trim(),
  check('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters')
    .trim(),
  check('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  check('dailyPrice')
    .notEmpty()
    .withMessage('Daily price is required')
    .isNumeric()
    .withMessage('Daily price must be a number')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Daily price must be greater than zero');
      }
      return true;
    }),
  check('location').notEmpty().withMessage('Location is required').trim(),
  check('condition')
    .notEmpty()
    .withMessage('Condition is required')
    .isIn(['New', 'Like New', 'Good', 'Fair'])
    .withMessage('Condition must be one of: New, Like New, Good, Fair'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, errors.array()[0].msg));
    }
    next();
  },
];

module.exports = {
  itemValidator,
};
