import React, { createContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { apiFetch } from "../apiFetch";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  console.log("cart count in contextapi",cartCount)
  // Fetch cart count from backend
  const fetchCartCount = async () => {
    try {
     
      const response = await apiFetch(`/cart/count`);
       
      if (!response.ok) {
        console.log("Failed to fetch cart count:", response.status);
        setCartCount(0);
        return;
      }

      const data = await response.json();
    const totalQty = data.cartCount || 0; // <-- read directly from object
      setCartCount(totalQty);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
