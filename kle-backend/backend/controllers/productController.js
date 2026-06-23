const { Product } = require('../models/Product');
const { User }    = require('../models/User');

// ── Get all products ──────────────────────────────────────────────────────────
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ message: 'Products fetched successfully', products });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Get single product ────────────────────────────────────────────────────────
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product found', product });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Add product ───────────────────────────────────────────────────────────────
const addProduct = async (req, res) => {
    try {
        const { name, image, stock, price, description, brand } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const user = await User.findOne({ email: req.user.email });

        const product = await Product.create({
            name, image, stock, price, description, brand,
            user: user._id
        });

        return res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Update product ────────────────────────────────────────────────────────────
const updateProduct = async (req, res) => {
    try {
        const { name, description, image, price, brand, stock } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, image, price, brand, stock },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Delete product ────────────────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product deleted successfully', product });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct };
