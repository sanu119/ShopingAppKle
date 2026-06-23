const express = require('express');
const router  = express.Router();
const { protect } = require('../middlewares/auth');
const {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.get('/',           getAllProducts);           // GET  /products
router.get('/:id',        protect, getProductById); // GET  /products/:id
router.post('/',          protect, addProduct);      // POST /products
router.patch('/:id',      protect, updateProduct);   // PATCH /products/:id
router.delete('/:id',     protect, deleteProduct);   // DELETE /products/:id

module.exports = router;
