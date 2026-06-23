const { User }  = require('../models/User');
const { Cart }  = require('../models/Cart');
const { Order } = require('../models/Order');

// ── Place Order ───────────────────────────────────────────────────────────────
// Called when user clicks "Place Order" on the cart page.
// Saves the order to the database, clears the cart, returns success message.
// No real payment gateway needed — simple simulation for teaching.

const placeOrder = async (req, res) => {
    try {
        // Get the logged-in user and their cart (with product details)
        const user = await User.findOne({ email: req.user.email }).populate({
            path: 'cart',
            populate: { path: 'products', model: 'Product' }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.cart || user.cart.products.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // Save the order in the database
        const order = await Order.create({
            user:          user._id,
            products:      user.cart.products.map(p => p._id),
            total:         user.cart.total,
            paymentStatus: 'paid'
        });

        // Clear the cart after placing the order
        await Cart.findByIdAndUpdate(user.cart._id, { products: [], total: 0 });

        return res.status(200).json({
            message: 'Payment done successfully! Your order has been placed.',
            orderId: order._id,
            total:   order.total
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { placeOrder };
