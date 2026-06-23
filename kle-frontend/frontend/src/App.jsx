import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider }  from "./context/AuthContext";
import { CartProvider }  from "./context/CartContext";
import Navbar            from "./components/Navbar";
import ProtectedRoute    from "./components/ProtectedRoute";
import ProductListing    from "./pages/ProductListing";
import ProductDetails    from "./pages/ProductDetails";
import Login             from "./pages/Login";
import Register          from "./pages/Register";
import Cart              from "./pages/Cart";
import AdminProducts     from "./pages/AdminProducts";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/"                element={<ProductListing />} />
              <Route path="/product/:id"     element={<ProductDetails />} />
              <Route path="/login"           element={<Login />} />
              <Route path="/register"        element={<Register />} />
              <Route path="/cart"            element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/admin/products"  element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
