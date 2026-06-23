import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) refreshCart();
    else setCart(null);
  }, [user]);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/cart", { auth: true });
      setCart(data.cart);
    } catch (err) {
      console.error("Cart load error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    const data = await apiFetch("/cart/add", {
      method: "POST",
      auth: true,
      body: { products: [productId] },
    });
    setCart(data.cart);
  };

  const removeFromCart = async (productId) => {
    const data = await apiFetch("/cart/remove", {
      method: "DELETE",
      auth: true,
      body: { productID: productId },
    });
    setCart(data.cart);
  };

  const itemCount = cart?.products?.length || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, addToCart, removeFromCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
