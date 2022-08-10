const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// delete an image
const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

// create hotel controller
exports.createHotel = async (req, res, next) => {
  console.log(req.user.userId);
  // get the validation result from the request object
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  // check if the image is provided
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  // get the image path
  const image = req.file.path.replace('\\', '/');
  // create the hotel object
  let creator;
  const hotel = new Hotel({
    ...req.body,
    images: image,
    // attach the user to the hotel
    creator: req.user.userId,
  });
  // save the hotel and add the hotel to the user array
  await hotel
    .save()
    .then(() => {
      return User.findById(req.user.userId);
    })
    .then((user) => {
      creator = user;
      user.hotels.push(hotel);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: 'Hotel created successfully!',
        hotel: hotel,
        creator: {
          _id: creator._id,
          name: creator.name,
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
// update hotel controller
exports.updateHotel = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
    });
  }
  const { id } = req.params;
  let { image, ...allFields } = req.body;
  if (req.file) {
    image = req.file.path.replace('\\', '/');
  }
  if (!image) {
    res.status(422).json({
      message: 'No image provided.',
    });
  }
  Hotel.findById(id)
    .then((hotel) => {
      // if no hotel is found, return error
      if (!hotel) {
        const error = new Error('Could not find hotel.');
        error.statusCode = 404;
        throw error;
      }
      // if the logged in user is not the creator of the hotel, return error
      if (hotel.creator.toString() !== req.user.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      // if image is provided, delete the old image
      if (image !== hotel.images) {
        clearImage(hotel.images);
      }
      // if hotel is found, update it
      hotel.name = allFields.name || hotel.name;
      hotel.type = allFields.type || hotel.type;
      hotel.city = allFields.city || hotel.city;
      hotel.title = allFields.title || hotel.title;
      hotel.address = allFields.address || hotel.address;
      hotel.distance = allFields.distance || hotel.distance;
      hotel.desc = allFields.desc || hotel.desc;
      hotel.cheapestPrice = allFields.cheapestPrice || hotel.cheapestPrice;
      hotel.cheapestPrice = allFields.cheapestPrice || hotel.cheapestPrice;
      hotel.images = image;
      return hotel.save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'Hotel updated successfully!',
        hotel: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// delete hotel controller
exports.deleteHotel = async (req, res, next) => {
  const { id } = req.params;
  await Hotel.findById(id)
    .then((hotel) => {
      if (!hotel) {
        const error = new Error('Could not find hotel.');
        error.statusCode = 404;
        throw error;
      }
      // check if the logged in user is the creator of the post
      if (hotel.creator.toString() !== req.user.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      // clear the image
      clearImage(hotel.images);
      // delete all rooms in the hotel related to the hotel
      Room.deleteMany({ hotel: id })
        .then(() => {
          // delete the hotel
          return hotel.deleteOne();
        })
        .then(() => {
          // deleate the hotel from the user array
          return User.findById(req.user.userId);
        })
        .then((user) => {
          user.hotels.pull(hotel);
          return user.save();
        })
        .then(() => {
          res.status(200).json({
            message: 'Hotel deleted successfully!',
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
};
// get hotel controller
exports.getHotel = async (req, res, next) => {
  const { id } = req.params;
  await Hotel.findById(id)
    .then((hotel) => {
      if (!hotel) {
        const error = new Error('Could not find hotel.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: 'Hotel found successfully!',
        hotel: hotel,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// get all hotels controller
exports.getHotels = async (req, res, next) => {
  const { min, max, ...otherQuery } = req.query;
  await Hotel.find({
    ...otherQuery,
    cheapestPrice: { $gte: min || 1, $lte: max || 9000 },
    // get by cheapest price
    // http:localhost:5000/api/hotels?min=1&max=9000
  })
    .limit(req.query.limit)
    .then((hotels) => {
      if (!hotels) {
        const error = new Error('Could not find hotels.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        hotels: hotels.length > 0 ? hotels : 'No hotels found.',
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// count hotels by city controller
exports.countHotelsByCity = async (req, res, next) => {
  const cities = req.query.cities.split(',');
  await Promise.all(
    cities.map((city) => {
      return Hotel.countDocuments({ city: city });
    })
  )
    .then((list) => {
      if (!list) {
        res.status(404).json({
          message: 'Could not find hotels.',
        });
      }
      res.status(200).json({
        message: 'Hotels found successfully!',
        list: list,
        cities: cities,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// count hotels by type controller
exports.countHotelsByType = async (req, res, next) => {
  const types = req.query.types.split(',');
  await Promise.all(
    types.map((type) => {
      return Hotel.countDocuments({ type: type });
    })
  )
    .then((list) => {
      if (!list) {
        res.status(404).json({
          message: 'Could not find hotels.',
        });
      }
      res.status(200).json({
        message: 'Hotels found successfully!',
        list: list,
        types: types,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// get hotel rooms controller
exports.getHotelRooms = async (req, res, next) => {
  // get all rooms of hotel
  const { id } = req.params;
  const hotel = await Hotel.findById(id);
  // the rooms of hotel are stored in the rooms array of hotel
  await Promise.all(
    hotel.rooms.map((room) => {
      return Room.findById(room);
    })
  ).then((list) => {
    if (!list) {
      res.status(404).json({
        message: 'Could not find rooms.',
        rooms: list,
      });
    }
    res.status(200).json({
      message: 'Rooms found successfully!',
      rooms: list,
    });
  });
};
