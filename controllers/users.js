const User = require('../models/User');
const { validationResult } = require('express-validator');

// update user controller
exports.updateUser = async (req, res, next) => {
  // adding validation to the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const { id } = req.params;
  // check if the logged in user is the creator of the post

  await User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then((user) => {
      // check if the logged in user is the creator of the post
      if (user._id.toString() !== req.user.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      // if user does not exist, return error
      if (!user) {
        const error = new Error('User does not exist');
        error.statusCode = 404;
        throw error;
      }
      //  update user in database
      res.status(200).json({
        message: 'User updated successfully!',
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
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      // if user does not exist, return error
      if (!user) {
        const error = new Error('User does not exist');
        error.statusCode = 404;
        throw error;
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
        const error = new Error('User does not exist');
        error.statusCode = 404;
        throw error;
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
        const error = new Error('Users do not exist');
        error.statusCode = 404;
        throw error;
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
