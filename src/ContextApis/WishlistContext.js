// WishlistContext — wishlist/favorites state.
// Source of truth is the backend (/wishlist), with an AsyncStorage cache so the
// feature stays instant and works offline. Toggles are optimistic: the UI
// updates immediately, then syncs with the server (rolling back on failure).

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "../apiFetch";
import { endpoints } from "../services/endpoints";

const STORAGE_KEY = "wishlist_items_v1";

export const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  // Map of productId -> product summary (so the Wishlist screen can render cards)
  const [items, setItems] = useState({});
  const [hydrated, setHydrated] = useState(false);

  const persist = useCallback(async (next) => {
    setItems(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {}
  }, []);

  // Pull the canonical list from the backend and reconcile the local cache.
  const syncFromServer = useCallback(async () => {
    try {
      const res = await apiFetch(endpoints.wishlist.list);
      if (!res.ok) return;
      const data = await res.json();
      const list = data.items || data.wishlist || data || [];
      if (!Array.isArray(list)) return;
      const map = {};
      list.forEach((p) => {
        if (p && p.id != null) map[String(p.id)] = p;
      });
      persist(map);
    } catch (e) {
      // Offline / endpoint unavailable — keep the local cache.
    }
  }, [persist]);

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
      syncFromServer();
    })();
  }, [syncFromServer]);

  const isWishlisted = useCallback((id) => !!items[String(id)], [items]);

  const toggleWishlist = useCallback(
    (product) => {
      const id = String(product?.id);
      if (!id || id === "undefined") return;

      // Optimistic local update.
      const prev = items;
      const next = { ...items };
      const wasWishlisted = !!next[id];
      if (wasWishlisted) delete next[id];
      else next[id] = product;
      persist(next);

      // Sync with the backend; roll back if it rejects.
      apiFetch(endpoints.wishlist.toggle, {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("toggle failed");
        })
        .catch((e) => {
          persist(prev); // rollback
          if (__DEV__) console.warn("wishlist toggle failed", e);
        });
    },
    [items, persist]
  );

  const removeFromWishlist = useCallback(
    (id) => {
      const product = items[String(id)];
      if (product) toggleWishlist(product);
    },
    [items, toggleWishlist]
  );

  const wishlistItems = Object.values(items);
  const count = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{ items, wishlistItems, count, hydrated, isWishlisted, toggleWishlist, removeFromWishlist, syncFromServer }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
