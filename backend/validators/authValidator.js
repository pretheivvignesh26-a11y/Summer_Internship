const { check, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const registerValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .trim(),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),
  check('phone')
    .optional({ checkFalsy: true })
    .isMobilePhone()
    .withMessage('Please provide a valid mobile number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, errors.array()[0].msg));
    }
    next();
  },
];

const loginValidator = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .trim(),
  check('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, errors.array()[0].msg));
    }
    next();
  },
];

module.exports = {
  registerValidator,
  loginValidator,
};
