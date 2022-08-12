const User = require('../models/User');
const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = global.process.env.JWT_SECRET;
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// signup controller for authentication
exports.signup = async (req, res, next) => {
  // adding validation to the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  // addong node mailer to send email
  const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: global.process.env.SENDGRID_API_KEY,
      },
    })
  );
  // check if user already exists in database
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const error = new Error('User already exists.');
    error.statusCode = 400;
    throw error;
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
        // send email a welcome message to the user
        transporter
          .sendMail({
            to: user.email,
            from: 'muhmmedmedhat0@gmail.com',
            subject: 'Welcome to Airbnb',
            html: `<h1>Welcome to Airbnb</h1>
            <p>You have successfully signed up to Airbnb.</p>
            <p>Your email: ${user.email}</p>
            <p>Your password: ${req.body.password}</p>
            <p>Thank you for using Airbnb.</p>`,
          })
          .then(() => {
            res.status(201).json({
              message: 'User created successfully!',
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
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  // check if user already exists in database
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User does not exist.');
    error.statusCode = 400;
    throw error;
  }
  // compare password with hashed password in database
  loadedUser = user;
  return bycript
    .compare(password, user.password)
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Password is incorrect.');
        error.statusCode = 400;
        throw error;
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

      const { password, ...otherDetails } = loadedUser._doc;
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
