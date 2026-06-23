import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import ProductCard from "../components/ProductCard";

const ProductListing = () => {
  const [products, setProducts]   = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch("/products");
        setProducts(data.products);
        setFiltered(data.products);
      } catch (err) {
        setError("Could not load products. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Live search filter
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      )
    );
  }, [search, products]);

  if (loading) return (
    <div className="page-state">
      <div className="spinner" />
      <p>Loading products…</p>
    </div>
  );

  if (error) return (
    <div className="page-state page-error">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="listing-page">
      {/* Hero */}
      <div className="listing-hero">
        <h1 className="listing-hero-title">Everything you need,<br />all in one place.</h1>
        <p className="listing-hero-sub">Quality products, delivered fast.</p>

        <div className="search-bar-wrap">
          <input
            className="search-bar"
            type="text"
            placeholder="Search products or brands…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="listing-content">
        {filtered.length === 0 ? (
          <div className="page-state">
            <p>No products match "<strong>{search}</strong>"</p>
          </div>
        ) : (
          <>
            <p className="listing-count">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
            <div className="product-grid">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListing;
