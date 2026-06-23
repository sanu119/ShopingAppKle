const express  = require('express');
const router   = express.Router();
const { protect }    = require('../middlewares/auth');
const { placeOrder } = require('../controllers/orderController');

router.post('/place', protect, placeOrder);   // POST /orders/place

module.exports = router;
