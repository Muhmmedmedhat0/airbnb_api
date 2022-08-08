require('dotenv').config();
require('./database/config');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = global.process.env.PORT;
const express = require('express');
const app = express();

// routes
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const hotelsRouter = require('./routes/hotels');
const roomsRouter = require('./routes/rooms');

// middlewares

app.use(cors()); // cross-origin resource sharing for communication between different origins
app.use(cookieParser()); // parse cookies
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/rooms', roomsRouter);

// error handling middleware - must be last in the chain of middleware (after all other middleware)
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(PORT, (error) => {
  console.log(error || `server is running on http://localhost:${PORT}`);
});
