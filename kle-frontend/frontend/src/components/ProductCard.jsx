import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const outOfStock = !product.stock || product.stock <= 0;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        {outOfStock && <span className="stock-flag">Out of stock</span>}
      </div>

      {product.brand && <div className="product-brand">{product.brand}</div>}
      <h3 className="product-title">{product.name}</h3>

      <div className="product-card-footer">
        <span className="price-tag">
          <span className="price-tag-currency">₹</span>
          {product.price}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
