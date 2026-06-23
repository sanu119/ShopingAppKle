import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);
  const [added, setAdded]       = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiFetch(`/products/${id}`, { auth: true });
        setProduct(data.product);
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="page-state"><div className="spinner" /><p>Loading…</p></div>
  );

  if (error || !product) return (
    <div className="page-state page-error"><p>{error || "Product not found"}</p></div>
  );

  const inStock = product.stock > 0;

  return (
    <div className="details-page">
      <div className="details-container">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>

        <div className="details-grid">
          {/* Image */}
          <div className="details-image-wrap">
            <img src={product.image} alt={product.name} className="details-image" />
          </div>

          {/* Info */}
          <div className="details-info">
            {product.brand && <div className="details-brand">{product.brand}</div>}
            <h1 className="details-title">{product.name}</h1>

            <div className="details-price">
              <span className="details-currency">₹</span>{product.price}
            </div>

            <div className={`details-stock ${inStock ? "in-stock" : "out-stock"}`}>
              {inStock ? `✓ In stock (${product.stock} left)` : "✗ Out of stock"}
            </div>

            {product.description && (
              <p className="details-description">{product.description}</p>
            )}

            <button
              className={`btn-primary btn-large ${added ? "btn-success" : ""}`}
              onClick={handleAddToCart}
              disabled={adding || !inStock}
            >
              {added ? "✓ Added to cart!" : adding ? "Adding…" : "Add to cart"}
            </button>

            <button className="btn-secondary btn-large" onClick={() => navigate("/cart")}>
              View cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
