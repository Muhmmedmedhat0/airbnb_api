const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment');

// CREATE A NEW PAYMENT
router.post('/', paymentController.createPayment);
module.exports = router;
