const User = require('../models/User');
const { validationResult } = require('express-validator');

// update user controller
exports.updateUser = async (req, res, next) => {
  // adding validation to the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array(),
    });
  }
  const { id } = req.params;
  const { ...allFields } = req.body;
  await User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'User not found.',
        });
      }
      user.wishlist.push(allFields.wishlist);
      user.name = allFields.name || user.name;
      user.email = allFields.email || user.email;
      user.country = allFields.country || user.country;
      user.phone = allFields.phone || user.phone;

      return user.save();
    })
    .then((user) => {
      return res.status(200).json({
        message: 'User updated successfully.',
        user: user,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
// delete user controller
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id)
    .then((user) => {
      // check if the logged in user is the creator of the post
      if (user._id.toString() !== req.user.userId) {
        return res.status(403).json({
          message: 'Not authorized!',
        });
      }
      // if user does not exist, return error
      if (!user) {
        return res.status(404).json({
          message: 'User does not exist',
        });
      }
      //  delete user from database
      res.status(200).json({
        message: 'User deleted successfully!',
        user: user,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
// get user controller
exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  // console.log(req.user.userId);
  await User.findById(id)
    .then((user) => {
      // if user does not exist, return error
      if (!user) {
        return res.status(404).json({
          message: 'User does not exist',
        });
      }
      //  get user from database
      res.status(200).json({
        message: 'User retrieved successfully!',
        user: user,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// get all users controller
exports.getUsers = async (req, res, next) => {
  await User.find()
    .then((users) => {
      // if users do not exist, return error
      if (!users) {
        return res.status(404).json({
          message: 'Users do not exist',
        });
      }
      //  get users from database
      res.status(200).json({
        message: 'Users retrieved successfully!',
        users: users,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
