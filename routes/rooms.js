const express = require('express');
const router = express.Router();
const { verifyHost } = require('../middlewares/verifyToken');
const { body } = require('express-validator');

const roomController = require('../controllers/rooms');

// CREATE A NEW ROOM
router.post('/:hotelId', verifyHost, roomController.createRoom);

// UPDATE A ROOM
router.put('/:id', verifyHost, roomController.updateRoom);

// UPDATE ROOM AVAILABILITY
router.put('/:id/availability', roomController.updateRoomAvailability);

// DELETE A ROOM
router.delete('/:hotelId/:roomId', verifyHost, roomController.deleteRoom);

// GET A ROOM
router.get('/:id', roomController.getRoom);

// GET ALL ROOMS
router.get('/', roomController.getAllRooms);

module.exports = router;
