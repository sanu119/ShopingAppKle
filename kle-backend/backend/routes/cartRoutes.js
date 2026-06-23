const express = require('express');
const router  = express.Router();
const { protect } = require('../middlewares/auth');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.get('/',            protect, getCart);         // GET    /cart
router.post('/add',        protect, addToCart);       // POST   /cart/add
router.delete('/remove',   protect, removeFromCart);  // DELETE /cart/remove

module.exports = router;
