const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotels');
const { body } = require('express-validator');
const { verifyHost } = require('../middlewares/verifyToken');

// CREATE A NEW HOTEL
router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 3 })
      .isString()
      .withMessage('Name must be at least 3 characters long.'),
    body('type')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Type must be at least 3 characters long.'),
    body('city')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('City must be at least 3 characters long.'),
    body('title')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Title must be at least 3 characters long.'),
    body('address')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Address must be at least 3 characters long.'),
    body('distance')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Distance must be at least 3 characters long.'),
    body('desc')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Description must be at least 3 characters long.'),
    body('chapestPrice')
      .trim()
      .isInt()
      .withMessage('Price must be an integer.'),
  ],
  verifyHost,
  hotelController.createHotel
);

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
