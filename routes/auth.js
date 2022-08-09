const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth');

// signup
router.post(
  '/signup',
  [
    body('name')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters long.'),
    body('email')
      .isEmail()
      .trim()
      .normalizeEmail()
      .withMessage('Invalid email'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
  ],
  authController.signup
);

// login
router.post(
  '/login',
  [body('email').isEmail().trim().normalizeEmail(), body('password').trim()],
  authController.login
);
module.exports = router;
