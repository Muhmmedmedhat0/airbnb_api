const User = require("../models/User");
const { validationResult } = require("express-validator");
const Hotel = require("../models/Hotel");

// update user controller
exports.updateUser = async (req, res, next) => {
  // adding validation to the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: errors.array(),
    });
  }
  const { id } = req.params;
  const { ...allFields } = req.body;
  await User.findById(id)
    .populate("wishlist")
    .populate("reservations")
    .populate("hotels")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: `couldn't find user` });
      }
      user.wishlist.push(allFields.wishlist);
      user.reservations.push(allFields.reservations);
      user.name = allFields.name || user.name;
      user.email = allFields.email || user.email;
      user.country = allFields.country || user.country;
      user.phone = allFields.phone || user.phone;
      user.isAdmin = allFields.isAdmin || user.isAdmin;

      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "user updated successfully",
        user: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  // await User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
  //   .then((user) => {
  //     // check if the logged in user is the creator to give access to update
  //     if (user._id.toString() !== req.user.userId) {
  //       return res.status(403).json({
  //         message: 'Not authorized!',
  //       });
  //     }
  //     // if user does not exist, return error
  //     if (!user) {
  //       return res.status(404).json({
  //         message: 'User does not exist',
  //       });
  //     }
  //     //  update user in database
  //     return res.status(200).json({
  //       message: 'User updated successfully!',
  //       user: user,
  //     });
  //   })
  //   .catch((err) => {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     next(err);
  //   });
};
// delete user controller
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id)
    .then((user) => {
      // check if the logged in user is the creator of the post
      // if (user._id.toString() !== req.user.userId || user.isAdmin !== "admin") {
      //   return res.status(403).json({
      //     message: "Not authorized!",
      //   });
      // }
      // if user does not exist, return error
      if (!user) {
        return res.status(404).json({
          message: "User does not exist",
        });
      }
      //  delete user from database
      res.status(200).json({
        message: "User deleted successfully!",
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
  await User.findById(id).populate("wishlist")
  .populate("reservations")
  .populate("hotels")
    .then((user) => {
      // if user does not exist, return error
      if (!user) {
        return res.status(404).json({
          message: "User does not exist",
        });
      }
      //  get user from database
      res.status(200).json({
        message: "User retrieved successfully!",
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
          message: "Users do not exist",
        });
      }
      //  get users from database
      res.status(200).json({
        message: "Users retrieved successfully!",
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
