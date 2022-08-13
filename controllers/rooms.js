const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { validationResult } = require('express-validator');

// create a new room
exports.createRoom = async (req, res, next) => {
  // adding validation to the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array()
    });
  }
  // after the room is created, add it to the hotel rooms array by using the hotelId in the request body
  const { hotelId } = req.params;
  const newRoom = new Room(req.body);
  // save the room
  await newRoom
    .save()
    .then((room) => {
      // find the hotel by the hotelId in the req.params
      Hotel.findById(hotelId)
        .then((hotel) => {
          // add the room to the hotel rooms array
          hotel.rooms.push(room._id);
          // save the hotel
          hotel.save();
          res.status(201).json({
            message: 'Room created successfully',
            room: room,
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

// update room controller
exports.updateRoom = async (req, res, next) => {
  // adding validation to the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array()
    });
  }
  await Room.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((room) => {
      // if  is not found, return 404
      if (!room) {
        return res.status(404).json({
          message: 'Room not found',
        });
      }
      res.status(200).json({
        message: 'Room updated successfully',
        room: room,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// update room availability controller
exports.updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { 'roomNumbers._id': req.params.id },
      {
        $push: {
          'roomNumbers.$.unavailableDates': req.body.dates,
        },
      }
    );
    res.status(200).json({
      message: 'Room availability updated successfully',
      dates: req.body.dates,
    });
  } catch (err) {
    next(err);
  }
};

// delete room controller
exports.deleteRoom = async (req, res, next) => {
  // delete the room from the hotel rooms array
  const { hotelId, roomId } = req.params;
  await Room.findByIdAndDelete(roomId).then(async (room) => {
    // if  is not found, return 404
    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }
    return Hotel.findById(hotelId)
      .then((hotel) => {
        // pull the room from the hotel rooms array
        hotel.rooms.pull(room._id);
        // save the hotel
        hotel.save();
        res.status(200).json({
          message: 'Room deleted successfully',
          room: room,
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

// get room controller
exports.getRoom = async (req, res, next) => {
  const { id } = req.params;
  await Room.findById(id)
    .then((room) => {
      // if  is not found, return 404
      if (!room) {
        return res.status(404).json({
          message: 'Room not found',
        });
      }
      res.status(200).json({
        message: 'Room found successfully',
        room: room,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// get all rooms controller
exports.getAllRooms = async (req, res, next) => {
  await Room.find()
    .then((rooms) => {
      // if  is not found, return 404
      if (!rooms) {
        return res.status(404).json({
          message: 'Rooms not found',
        });
      }
      res.status(200).json({
        message: 'Rooms found successfully',
        rooms: rooms,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
