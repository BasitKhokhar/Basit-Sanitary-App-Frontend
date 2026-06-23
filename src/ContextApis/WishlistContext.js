// WishlistContext — wishlist/favorites state.
// Persists locally via AsyncStorage so the feature works immediately.
// If a backend /wishlist endpoint exists it will sync; otherwise local-only.
// ⚠️ BACKEND TODO: implement GET/POST/DELETE /wishlist to enable cross-device sync.

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "wishlist_items_v1";

export const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  // Map of productId -> product summary (so the Wishlist screen can render cards)
  const [items, setItems] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch (e) {
        // ignore corrupt cache
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setItems(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {}
  }, []);

  const isWishlisted = useCallback((id) => !!items[String(id)], [items]);

  const toggleWishlist = useCallback(
    (product) => {
      const id = String(product?.id);
      if (!id || id === "undefined") return;
      const next = { ...items };
      if (next[id]) delete next[id];
      else next[id] = product;
      persist(next);
    },
    [items, persist]
  );

  const removeFromWishlist = useCallback(
    (id) => {
      const next = { ...items };
      delete next[String(id)];
      persist(next);
    },
    [items, persist]
  );

  const wishlistItems = Object.values(items);
  const count = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{ items, wishlistItems, count, hydrated, isWishlisted, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
