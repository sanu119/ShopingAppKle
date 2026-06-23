import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, loading, removeFromCart, refreshCart } = useCart();

  // When order is placed successfully we show the success screen right here
  const [orderDone, setOrderDone]   = useState(false);
  const [orderInfo, setOrderInfo]   = useState(null);   // { orderId, total }
  const [placing, setPlacing]       = useState(false);
  const [error, setError]           = useState("");

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      // POST /orders/place — backend saves order, clears cart, returns success message
      const data = await apiFetch("/orders/place", { method: "POST", auth: true });

      // Refresh the cart so it shows empty after order
      await refreshCart();

      setOrderInfo({ orderId: data.orderId, total: data.total });
      setOrderDone(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) return (
    <div className="page-state">
      <div className="spinner" />
      <p>Loading cart…</p>
    </div>
  );

  // ── Success screen — shown after order is placed ───────────────────────────
  if (orderDone) return (
    <div className="result-page">
      <div className="result-card">

        <div className="result-icon">✓</div>

        <h1 className="result-title">Payment Done Successfully!</h1>

        <p className="result-sub">
          Thank you for your order. Your items will be delivered soon.
        </p>

        {orderInfo?.total && (
          <p className="result-total">Amount paid: <strong>₹{orderInfo.total}</strong></p>
        )}

        {orderInfo?.orderId && (
          <p className="result-order-id">
            Order ID: <code>{orderInfo.orderId}</code>
          </p>
        )}

        <Link to="/" className="btn-primary">Continue Shopping</Link>

      </div>
    </div>
  );

  // ── Empty cart ─────────────────────────────────────────────────────────────
  const products = cart?.products || [];

  if (products.length === 0) return (
    <div className="page-state">
      <div className="empty-cart-icon">🛍️</div>
      <h2 className="empty-cart-title">Your cart is empty</h2>
      <p className="empty-cart-sub">Browse our products and add something you like.</p>
      <Link to="/" className="btn-primary">Browse products</Link>
    </div>
  );

  // ── Cart with items ────────────────────────────────────────────────────────
  return (
    <div className="cart-page">
      <div className="cart-container">

        <h1 className="cart-title">Your Cart</h1>
        <p className="cart-count">{products.length} item{products.length !== 1 ? "s" : ""}</p>

        {error && <div className="cart-error">{error}</div>}

        <div className="cart-layout">

          {/* Items list */}
          <div className="cart-items">
            {products.map((product) => (
              <div key={product._id} className="cart-item">
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <p className="cart-item-name">{product.name}</p>
                  {product.brand && <p className="cart-item-brand">{product.brand}</p>}
                </div>
                <div className="cart-item-price">₹{product.price}</div>
                <button
                  className="cart-item-remove"
                  onClick={() => handleRemove(product._id)}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal ({products.length} items)</span>
              <span>₹{cart.total}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-ship">Free</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{cart.total}</span>
            </div>

            <button
              className="btn-primary btn-full btn-large"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? "Placing order…" : "Place Order →"}
            </button>

            <p className="summary-note">
              🔒 Your order is safe and secure.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
