const DATABASE_URL =
  global.process.env.DATABASE_URL || 'mongodb://localhost:27017/airbnb';
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log(`connected to MongoDB ${DATABASE_URL}`);
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });
module.exports = mongoose;
