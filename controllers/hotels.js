const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const fs = require('fs');

//  delete the old images from the server when the hotel is updated
const clearImage = (oldImages) => {
  oldImages.map((image) => {
    fs.unlink(image, (err) => console.log(err));
  }),
    (err) => console.log(err);
};

// create hotel controller
exports.createHotel = async (req, res, next) => {
  // get the validation result from the request object
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422).json({
  //     message: 'Validation failed, entered data is incorrect.',
  //     errors: errors.array(),
  //   });
  // }
  // const images = req.files.map((file) => file.path.replace('\\', '/'));
  // // check if thers is an image
  // if (images.length === 0) {
  //   return res.status(422).json({
  //     message: 'No images provided.',
  //   });
  // }
  // get the hotel data from the request body
  const { ...allFields } = req.body;
  let creator;
  const hotel = new Hotel({
    ...allFields,
    creator: req.user.userId,
    // images: images,
  });
  // save the hotel to the database
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
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array(),
    });
  }
  const { id } = req.params;
  let { ...allFields } = req.body;
  let images;
  // check if theres is an image to update
  if (req.files) {
    images = req.files.map((file) => file.path.replace('\\', '/'));
  }
  if (images.length === 0) {
    return res.status(422).json({
      message: 'No images provided.',
    });
  }
  await Hotel.findById(id)
    .then((hotel) => {
      if (!hotel) {
        return res.status(404).json({
          message: 'Could not find hotel.',
        });
      }
      // check if the logged in user is the creator of the hotel
      if (hotel.creator.toString() !== req.user.userId) {
        return res.status(403).json({
          message: 'Not authorized!',
        });
      }
      // if images are provided, clear the old images
      if (images !== hotel.images) {
        clearImage(hotel.images);
      }
      // update the hotel
      hotel.name = allFields.name || hotel.name;
      hotel.type = allFields.type || hotel.type;
      hotel.city = allFields.city || hotel.city;
      hotel.title = allFields.title || hotel.title;
      hotel.address = allFields.address || hotel.address;
      hotel.distance = allFields.distance || hotel.distance;
      hotel.desc = allFields.desc || hotel.desc;
      hotel.images = images || hotel.images;
      hotel.cheapestPrice = allFields.cheapestPrice || hotel.cheapestPrice;
      hotel.featured = allFields.featured || hotel.featured;
      hotel.rating = allFields.rating || hotel.rating;
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
        return res.status(404).json({
          message: 'Could not find hotel.',
        });
      }
      // check if the logged in user is the creator of the post
      if (hotel.creator.toString() !== req.user.userId) {
        return res.status(403).json({
          message: 'Not authorized!',
        });
      }
      // clear the image
      clearImage(hotel.images);
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
        return res.status(404).json({
          message: 'Could not find hotel.',
        });
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
        return res.status(404).json({
          message: 'Could not find hotels.',
        });
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
        return res.status(404).json({
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
        return res.status(404).json({
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
      return res.status(404).json({
        message: 'Could not find rooms.',
      });
    }
    res.status(200).json({
      message: 'Rooms found successfully!',
      rooms: list,
    });
  });
};
