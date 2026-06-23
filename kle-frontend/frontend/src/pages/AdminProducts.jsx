import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

// Empty form state — reused for both Add and Edit
const emptyForm = { name: "", brand: "", price: "", stock: "", image: "", description: "" };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // form state
  const [form, setForm]         = useState(emptyForm);
  const [editId, setEditId]     = useState(null);   // null = Add mode, string = Edit mode
  const [saving, setSaving]     = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // delete confirmation
  const [deleteId, setDeleteId] = useState(null);   // id of product pending delete

  // ── Fetch all products ──────────────────────────────────────────────────────
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/products");
      setProducts(data.products);
    } catch (err) {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  // ── Form helpers ────────────────────────────────────────────────────────────
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setFormError("");
  };

  // Click Edit — pre-fill the form with the product's current values
  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      name:        product.name        || "",
      brand:       product.brand       || "",
      price:       product.price       || "",
      stock:       product.stock       || "",
      image:       product.image       || "",
      description: product.description || "",
    });
    setFormError("");
    // Scroll to the form
    document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Submit: Add or Update ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.price) {
      setFormError("Name and Price are required.");
      return;
    }

    setSaving(true);
    try {
      const body = {
        name:        form.name.trim(),
        brand:       form.brand.trim(),
        price:       Number(form.price),
        stock:       Number(form.stock) || 0,
        image:       form.image.trim(),
        description: form.description.trim(),
      };

      if (editId) {
        // ── UPDATE existing product ──
        await apiFetch(`/products/${editId}`, { method: "PATCH", auth: true, body });
        showSuccess("Product updated successfully!");
      } else {
        // ── ADD new product ──
        await apiFetch("/products", { method: "POST", auth: true, body });
        showSuccess("Product added successfully!");
      }

      resetForm();
      loadProducts();   // refresh the list
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiFetch(`/products/${deleteId}`, { method: "DELETE", auth: true });
      setDeleteId(null);
      showSuccess("Product deleted.");
      loadProducts();
    } catch (err) {
      setFormError(err.message);
      setDeleteId(null);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* Page header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Product Management</h1>
            <p className="admin-sub">Add, edit or delete products from your store.</p>
          </div>
          <div className="admin-count">{products.length} products</div>
        </div>

        {/* Global success banner */}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {/* ── ADD / EDIT FORM ─────────────────────────────────────────────── */}
        <div className="admin-card" id="product-form">
          <h2 className="admin-card-title">
            {editId ? "✏️  Edit Product" : "➕  Add New Product"}
          </h2>

          {formError && <div className="alert alert-error">{formError}</div>}

          <form className="product-form" onSubmit={handleSubmit}>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Product Name <span className="required">*</span></label>
                <input className="form-input" name="name" placeholder="e.g. Wireless Headphones"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-input" name="brand" placeholder="e.g. Sony"
                  value={form.brand} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price (₹) <span className="required">*</span></label>
                <input className="form-input" name="price" type="number" min="0" placeholder="999"
                  value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input className="form-input" name="stock" type="number" min="0" placeholder="50"
                  value={form.stock} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input className="form-input" name="image" type="url"
                placeholder="https://example.com/product.jpg"
                value={form.image} onChange={handleChange} />
            </div>

            {/* Live image preview */}
            {form.image && (
              <div className="image-preview-wrap">
                <img src={form.image} alt="preview" className="image-preview"
                  onError={(e) => { e.target.style.display = "none"; }} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input form-textarea" name="description"
                placeholder="Short product description…"
                value={form.description} onChange={handleChange} />
            </div>

            <div className="form-actions">
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : editId ? "Update Product" : "Add Product"}
              </button>
              {editId && (
                <button className="btn-secondary" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>

          </form>
        </div>

        {/* ── PRODUCT TABLE ───────────────────────────────────────────────── */}
        <div className="admin-card">
          <h2 className="admin-card-title">📦  All Products</h2>

          {loading ? (
            <div className="page-state"><div className="spinner" /><p>Loading…</p></div>
          ) : products.length === 0 ? (
            <div className="page-state">
              <p>No products yet. Add your first product above.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className={editId === p._id ? "row-editing" : ""}>
                      <td>
                        <div className="table-img-wrap">
                          {p.image
                            ? <img src={p.image} alt={p.name} className="table-img" />
                            : <span className="table-img-placeholder">📦</span>
                          }
                        </div>
                      </td>
                      <td>
                        <span className="table-name">{p.name}</span>
                        {p.description && (
                          <span className="table-desc">{p.description.slice(0, 60)}{p.description.length > 60 ? "…" : ""}</span>
                        )}
                      </td>
                      <td>{p.brand || <span className="text-muted">—</span>}</td>
                      <td><span className="table-price">₹{p.price}</span></td>
                      <td>
                        <span className={`stock-badge ${p.stock > 0 ? "in-stock" : "out-stock"}`}>
                          {p.stock > 0 ? p.stock : "Out"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn edit-btn" onClick={() => handleEdit(p)}>
                            ✏️ Edit
                          </button>
                          <button className="action-btn delete-btn" onClick={() => setDeleteId(p._id)}>
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ── DELETE CONFIRMATION MODAL ──────────────────────────────────────── */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <h3 className="modal-title">Delete Product?</h3>
            <p className="modal-sub">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={handleDelete}>Yes, Delete</button>
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
