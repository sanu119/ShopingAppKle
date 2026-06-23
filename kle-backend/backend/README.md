# KLE Store — Backend

Simple Express + MongoDB REST API.  
Features: User register/login (JWT), Products, Cart, Place Order.  
No payment gateway — clicking "Place Order" marks the order as paid instantly.

## 📁 MVC Structure

```
server.js                 ← Entry point. Starts the server.
config/
  db.js                   ← MongoDB connection
middlewares/
  auth.js                 ← JWT protect middleware
models/
  User.js                 ← User schema (name, email, password, cart ref)
  Product.js              ← Product schema (name, price, brand, stock, image)
  Cart.js                 ← Cart schema (products[], total)
  Order.js                ← Order schema (user, products, total, paymentStatus)
controllers/
  authController.js       ← register, login
  productController.js    ← getAllProducts, getProductById, addProduct, updateProduct, deleteProduct
  cartController.js       ← getCart, addToCart, removeFromCart
  orderController.js      ← placeOrder (saves order, clears cart, returns success)
routes/
  authRoutes.js           ← POST /register  POST /login
  productRoutes.js        ← GET /products   GET /products/:id  POST/PATCH/DELETE /products
  cartRoutes.js           ← GET /cart   POST /cart/add   DELETE /cart/remove
  orderRoutes.js          ← POST /orders/place
```

## 🚀 Setup

### 1. Install
```bash
npm install
```

### 2. Create .env file
```bash
cp .env.example .env
```
Fill in three values:

| Variable | Value |
|---|---|
| `MONGODB_URL` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any random string e.g. `mysecret123` |
| `PORT` | `8080` (or any port you like) |

### 3. Run
```bash
npm run dev    # with auto-restart
npm start      # without
```

## 📡 API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /register | ✗ | Create account |
| POST | /login | ✗ | Login, returns token |
| GET | /products | ✗ | All products |
| GET | /products/:id | ✓ | Single product |
| POST | /products | ✓ | Add product |
| PATCH | /products/:id | ✓ | Update product |
| DELETE | /products/:id | ✓ | Delete product |
| GET | /cart | ✓ | Get my cart |
| POST | /cart/add | ✓ | Add product to cart |
| DELETE | /cart/remove | ✓ | Remove product from cart |
| POST | /orders/place | ✓ | Place order (clears cart, returns success) |

> Auth routes need a `token` header: `token: <your_jwt_token>`
