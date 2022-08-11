const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { verifyUser, verifyAdmin } = require('../middlewares/verifyToken');
const { body } = require('express-validator');

// UPDATE A USER
router.put(
  '/:id',
  [
    body('name').isString().isLength({ min: 3 }).trim(),
    body('email').isEmail().normalizeEmail().trim(),
    body('password').isString().isLength({ min: 4 }).trim(),
    body('country').isString().trim(),
    body('city').isString().trim(),
    body('phone').isString().trim(),
  ],
  verifyUser,
  userController.updateUser
);
// DELETE A USER
router.delete('/:id', verifyUser, userController.deleteUser);
// GET A USER
router.get('/:id', verifyUser, userController.getUser);
// GET ALL USERS
router.get('/', verifyAdmin, userController.getUsers);

module.exports = router;
