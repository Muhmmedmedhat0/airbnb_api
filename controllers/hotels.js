const Hotel = require('../models/Hotel');
// create hotel controller
exports.createHotel = async (req, res, next) => {
  const hotel = await new Hotel(req.body);
  hotel
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
  const hotel = await Hotel.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true }
  )
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
  const hotel = await Hotel.findByIdAndDelete(id)
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
  const hotel = await Hotel.findById(id)
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
  const hotels = await Hotel.find()
    .then((hotels) => {
      if (!hotels) {
        const error = new Error('Could not find hotels.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: 'Hotels found successfully!',
        hotels: hotels,
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
