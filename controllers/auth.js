const User = require('../models/User');
const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = global.process.env.JWT_SECRET;
const { validationResult } = require('express-validator');

// signup controller for authentication
exports.signup = async (req, res, next) => {
  // adding validation to the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array(),
    });
  }
  // check if user already exists in database
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  // hash password before saving it to the database
  bycript.hash(req.body.password, 12).then((hashedPw) => {
    const user = new User({
      ...req.body,
      password: hashedPw,
    });
    // save user to database
    user
      .save()
      .then((user) => {
        const { password, isAdmin, ...otherDetails } = user._doc;
        res.status(201).json({
          message: 'User created!',
          user: { ...otherDetails },
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};

// login controller for authentication
exports.login = async (req, res, next) => {
  // adding validation to the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array(),
    });
  }
  // check if user already exists in database
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'User does not exist' });
  }
  // compare password with hashed password in database
  loadedUser = user;
  return bycript
    .compare(password, user.password)
    .then((isEqual) => {
      if (!isEqual) {
        return res.status(400).json({ error: 'Password is incorrect' });
      }
      // if password is correct, send the user's id and token
      const token = jwt.sign(
        {
          isAdmin: loadedUser.isAdmin,
          userId: loadedUser._id.toString(),
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      const { password, isAdmin, ...otherDetails } = loadedUser._doc;
      res
        .cookie('token', token, { httpOnly: true }, { secure: true })
        .status(200)
        .json({
          message: `Welcome ${loadedUser.name}!`,
          user: {
            ...otherDetails,
          },
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
