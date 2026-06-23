const mongoose = require('mongoose');

// Order is created when the user clicks "Place Order" on the cart page
const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    products: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        }
    ],

    total: {
        type: Number,
        required: true
    },

    paymentStatus: {
        type: String,
        default: 'paid'       // no real payment gateway — always mark paid
    }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = { Order };
