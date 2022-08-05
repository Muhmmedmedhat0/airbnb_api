const DATABASE_URL = global.process.env.DATABASE_URL;
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log(`connected to MongoDB Successfully`);
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });
module.exports = mongoose;
