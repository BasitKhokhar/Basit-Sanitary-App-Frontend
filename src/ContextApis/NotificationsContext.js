import React, { createContext, useState, useContext, useEffect } from "react";
import { apiFetch } from "../apiFetch";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // 📡 Fetch user's notifications (paginated)
  const fetchNotifications = async (pageNum = 1, append = false) => {
    try {
      const res = await apiFetch(`/notifications/allnotifications?page=${pageNum}&limit=10`);
      const data = await res.json();

      if (data.success) {
        if (append) {
          setNotifications((prev) => [...prev, ...data.notifications]);
        } else {
          setNotifications(data.notifications);
        }

        setUnreadCount(data.unreadCount);
        setHasMore(data.hasMore);
        setPage(pageNum);
      }
    } catch (err) {
      console.log("⚠️ Error loading notifications:", err);
    }
  };

  // 🔖 Mark a notification as read
  const markAsRead = async (id) => {
    try {
      await apiFetch(`/notifications/update/${id}`, {
        method: "PUT",
      });

      // Update frontend state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.log("⚠️ Error marking notification read:", err);
    }
  };

  // 🔔 Create notification manually (optional)
  const createNotification = async (title, message, type = "info") => {
    try {
      await apiFetch("/notifications/Createnotifications", {
        method: "POST",
        body: JSON.stringify({ title, message, type }),
        headers: { "Content-Type": "application/json" },
      });

      fetchNotifications(); // refresh
    } catch (err) {
      console.log("⚠️ Error creating notification:", err);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,

        fetchNotifications,
        markAsRead,
        createNotification,

        page,
        hasMore,
        loadingMore,
        setLoadingMore,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
