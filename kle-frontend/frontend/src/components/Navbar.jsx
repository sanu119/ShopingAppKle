import React from "react";
import { FaShoppingBag, FaUser, FaBoxOpen } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Brand */}
        <Link to="/" className="nav-brand">
          <span className="nav-brand-mark">KLE</span>
          <span className="nav-brand-word">Store</span>
        </Link>

        {/* Actions */}
        <div className="nav-actions">
          {user ? (
            <>
              {/* Manage Products link — visible to logged-in users */}
              <Link to="/admin/products" className="nav-btn nav-btn-admin">
                <FaBoxOpen size={14} />
                <span className="nav-btn-label">Manage Products</span>
              </Link>

              <span className="nav-greeting">Hi, {user.name.split(" ")[0]}</span>

              <button className="nav-btn" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-btn">
              <FaUser size={14} />
              Sign in
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="nav-btn nav-cart">
            <span className="cart-icon">
              <FaShoppingBag size={16} />
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </span>
            Cart
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
