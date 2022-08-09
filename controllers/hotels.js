const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { validationResult } = require('express-validator');
// create hotel controller
exports.createHotel = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  // validate the image from the req.file
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const images = req.file.path.replace('\\', '/');
  const hotel = new Hotel({
    ...req.body,
    images: images,
  });
  await hotel
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Hotel created successfully!',
        hotel: result,
      });
    })
    .catch((err) => {
      // if statusCode is not set, set it to 500
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// update hotel controller
exports.updateHotel = async (req, res, next) => {
  const { id } = req.params;
  await Hotel.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then((hotel) => {
      if (!hotel) {
        const error = new Error('Could not find hotel.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: 'Hotel updated successfully!',
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

// delete hotel controller
exports.deleteHotel = async (req, res, next) => {
  const { id } = req.params;
  await Hotel.findByIdAndDelete(id)
    .then((hotel) => {
      if (!hotel) {
        const error = new Error('Could not find hotel.');
        error.statusCode = 404;
        throw error;
      }
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
    chapestPrice: { $gte: min || 1, $lte: max || 9000 },
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
