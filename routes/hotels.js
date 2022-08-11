const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotels');
const { body } = require('express-validator');
const { verifyHost } = require('../middlewares/verifyToken');

// CREATE A NEW HOTEL
router.post('/', verifyHost, hotelController.createHotel);

// UPDATE A HOTEL
router.put('/:id', verifyHost, hotelController.updateHotel);

// DELETE A HOTEL
router.delete('/:id', verifyHost, hotelController.deleteHotel);

// GET A HOTEL
router.get('/find/:id', hotelController.getHotel);

// GET ALL HOTELS
router.get('/', hotelController.getHotels);

// COUNT HOTELS BY CITY
// http://localhost:8080/api/hotels/getByCity?cities=london,egypt,usa
router.get('/getByCity', hotelController.countHotelsByCity);

// COUNT HOTELS BY TYPE
// http://localhost:8080/api/hotels/getByType?types=hotel,villa,room
router.get('/getByType', hotelController.countHotelsByType);

// GET HOTEL ROOMS
router.get('/:id/rooms', hotelController.getHotelRooms);

module.exports = router;
