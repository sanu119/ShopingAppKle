const { User }    = require('../models/User');
const { Cart }    = require('../models/Cart');
const { Product } = require('../models/Product');

// ── Get cart ─────────────────────────────────────────────────────────────────
const getCart = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).populate({
            path: 'cart',
            populate: { path: 'products', model: 'Product' }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ cart: user.cart });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Add product to cart ───────────────────────────────────────────────────────
const addToCart = async (req, res) => {
    try {
        const { products: productIds } = req.body;  // array of product _id strings

        const user = await User.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        let cart;

        if (user.cart) {
            // User already has a cart — add new items if not already present
            cart = await Cart.findById(user.cart).populate('products');

            const existingIds = cart.products.map(p => p._id.toString());

            for (const productId of productIds) {
                if (!existingIds.includes(productId)) {
                    cart.products.push(productId);
                }
            }
        } else {
            // First time — create a new cart
            cart = new Cart({ products: productIds, total: 0 });
            await cart.save();
            user.cart = cart._id;
            await user.save();
        }

        // Recalculate total from the actual product prices
        await cart.populate('products');
        cart.total = cart.products.reduce((sum, p) => sum + p.price, 0);
        await cart.save();

        return res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Remove product from cart ─────────────────────────────────────────────────
const removeFromCart = async (req, res) => {
    try {
        const { productID } = req.body;

        const user = await User.findOne({ email: req.user.email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const cart = await Cart.findById(user.cart).populate('products');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const index = cart.products.findIndex(p => p._id.toString() === productID);
        if (index === -1) return res.status(404).json({ message: 'Product not in cart' });

        cart.products.splice(index, 1);
        cart.total = cart.products.reduce((sum, p) => sum + p.price, 0);
        await cart.save();

        return res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart };
