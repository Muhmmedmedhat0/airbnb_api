const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotels');
const { verifyHost, verifyAdmin } = require('../middlewares/verifyToken');

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
// 
router.get('/getByCity', hotelController.countHotelsByCity);

// COUNT HOTELS BY TYPE
router.get('/getByType', hotelController.countHotelsByType);

module.exports = router;
