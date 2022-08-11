const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotels');
const { body } = require('express-validator');
const { verifyHost } = require('../middlewares/verifyToken');

// CREATE A NEW HOTEL
router.post(
  '/',
  [
    body('name').isString().isLength({ min: 3 }),
    body('type').isString().isLength({ min: 3 }),
    body('city').isString().isLength({ min: 3 }),
    body('title').isString().isLength({ min: 3 }),
    body('address').isString().isLength({ min: 3 }),
    body('distance').isString().isLength({ min: 3 }),
    body('desc').isString().isLength({ min: 3 }),
    body('cheapestPrice').isNumeric(),
    body('rating').isNumeric(),
  ],
  verifyHost,
  hotelController.createHotel
);

// UPDATE A HOTEL
router.put(
  '/:id',
  [
    body('name').isString().isLength({ min: 3 }),
    body('type').isString().isLength({ min: 3 }),
    body('city').isString().isLength({ min: 3 }),
    body('title').isString().isLength({ min: 3 }),
    body('address').isString().isLength({ min: 3 }),
    body('distance').isString().isLength({ min: 3 }),
    body('desc').isString().isLength({ min: 3 }),
    body('cheapestPrice').isNumeric(),
    body('rating').isNumeric(),
  ],
  verifyHost,
  hotelController.updateHotel
);

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
