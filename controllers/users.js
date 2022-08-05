const User = require('../models/User');

// update user controller
exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then((user) => {
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
