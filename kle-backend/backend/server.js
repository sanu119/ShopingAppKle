require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const connectDB  = require('./config/db');

// ── Route files ───────────────────────────────────────────────────────────────
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes    = require('./routes/cartRoutes');
const orderRoutes   = require('./routes/orderRoutes');

// ── Connect to Database ───────────────────────────────────────────────────────
connectDB();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/',         authRoutes);     // POST /register   POST /login
app.use('/products', productRoutes);  // GET /products    GET /products/:id  etc.
app.use('/cart',     cartRoutes);     // GET /cart        POST /cart/add     DELETE /cart/remove
app.use('/orders',   orderRoutes);    // POST /orders/place

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
});
