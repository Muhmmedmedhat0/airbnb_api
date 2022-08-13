require('dotenv').config();
require('./database/config');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const PORT = global.process.env.PORT;
const express = require('express');
const app = express();

// configure multer to store files in the images folder
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'images';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp'
  ) {
    // valid file
    cb(null, true);
  } else {
    // invalid file
    cb(null, false);
  }
};

// routes
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const hotelsRouter = require('./routes/hotels');
const roomsRouter = require('./routes/rooms');
const paymentRouter = require('./routes/payment');

// middlewares
app.use(cors()); // cross-origin resource sharing for communication between different origins
app.use(cookieParser()); // parse cookies
app.use('/images', express.static(path.join(__dirname, 'images', '/'))); // serve static files from the images folder
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array('images', 10)
); // parse images from the request
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/payment', paymentRouter);

// error handling middleware - must be last in the chain of middleware (after all other middleware)
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  console.log(status);
  // const message = error.message || 'Internal Server Error';
  // const data = error.data;
  // res.status(status).json({ message: message, data: data });
});
app.listen(PORT, (error) => {
  console.log(error || `server is running on http://localhost:${PORT}`);
});
// DATABASE_URL=mongodb+srv://Muhmmed_Medhat:01098014450@cluster0.yb2nz.mongodb.net/airbnb-api?retryWrites=true&w=majority
// DATABASE_URL=mongodb://localhost:27017/airbnb
