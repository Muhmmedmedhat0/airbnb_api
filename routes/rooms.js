const express = require('express');
const router = express.Router();
const { verifyHost } = require('../middlewares/verifyToken');
const { body } = require('express-validator');

const roomController = require('../controllers/rooms');

// CREATE A NEW ROOM
router.post(
  '/:hotelId',
  [
    body('title').isString().isLength({ min: 3 }),
    body('price').isFloat({ gt: 0 }),
    body('maxPeople').isInt({ gt: 0 }),
    body('desc').isString().isLength({ min: 3 }),
    body('roomNumbers.*.number').isInt({ gt: 0 }),
  ],
  verifyHost,
  roomController.createRoom
);

// UPDATE A ROOM
router.put(
  '/:id',
  [
    body('title').isString().isLength({ min: 3 }),
    body('price').isFloat({ gt: 0 }),
    body('maxPeople').isInt({ gt: 0 }),
    body('desc').isString().isLength({ min: 3 }),
    body('roomNumbers.*.number').isInt({ gt: 0 }),
  ],
  verifyHost,
  roomController.updateRoom
);

// UPDATE ROOM AVAILABILITY
router.put('/:id/availability', roomController.updateRoomAvailability);

// DELETE A ROOM
router.delete('/:hotelId/:roomId', verifyHost, roomController.deleteRoom);

// GET A ROOM
router.get('/:id', roomController.getRoom);

// GET ALL ROOMS
router.get('/', roomController.getAllRooms);

module.exports = router;
