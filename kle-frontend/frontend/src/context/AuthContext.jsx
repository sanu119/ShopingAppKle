import React, { createContext, useContext, useState } from "react";
import { apiFetch } from "../api/api";

const AuthContext = createContext(null);

// Wrap the app with this provider so every page can know who's logged in.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const data = await apiFetch("/login", {
      method: "POST",
      body: { email, password },
    });

    const loggedInUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return loggedInUser;
  };

  const register = async (name, email, password) => {
    return apiFetch("/register", {
      method: "POST",
      body: { name, email, password },
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Small custom hook so components can just call useAuth()
export const useAuth = () => useContext(AuthContext);
