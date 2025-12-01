import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { colors } from "../../../Components/Themes/colors";
import { apiFetch } from "../../apiFetch";
import { useNavigation } from "@react-navigation/native";
// import { useNotifications } from "../../Context/NotificationContext";
import { useNotification } from "../../ContextApis/NotificationsContext";
function AllNotifications() {
  const navigation = useNavigation();

  const {
    notifications,
    fetchNotifications,
    page,
    hasMore,
    loadingMore,
    setLoadingMore,
  } = useNotification();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loadingRead, setLoadingRead] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications(1, false);
    setRefreshing(false);
  };

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchNotifications(page + 1, true);
    setLoadingMore(false);
  }, [loadingMore, hasMore, page]);

  const markAsRead = async (id) => {
    try {
      setLoadingRead(true);
      await apiFetch(`/notifications/mark-as-read/${id}`, { method: "PUT" });
      await fetchNotifications(1, false);
    } catch (err) {
      console.error("Failed to mark as read:", err);
    } finally {
      setLoadingRead(false);
    }
  };

  const handleNotificationPress = (item) => {
    setSelectedNotification(item);
    setModalVisible(true);

    if (!item.isRead) markAsRead(item.id);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedNotification(null);
  };

  const handleGoToAssets = () => {
    setModalVisible(false);
    navigation.navigate("BottomTabs", { screen: "Assets" });
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.headingrow}>
        <Text style={styles.title}>{item.title}</Text>

        <Text
          style={[
            styles.statusText,
            { backgroundColor: item.isRead ? colors.border : colors.error },
          ]}
        >
          {item.isRead ? "Seen" : "Unseen"}
        </Text>
      </View>

      <Text style={styles.message} numberOfLines={2}>
        {item.message}
      </Text>

      <Text style={styles.time}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications yet.</Text>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 15 }}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
      />

      {/* POPUP MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>

            {/* ❌ Cross Icon at Top Right */}
            <Pressable onPress={handleCloseModal} style={styles.closeIconWrapper}>
              <Icon name="close" size={20} color={colors.primary} />
            </Pressable>

            {selectedNotification && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedNotification.title}
                </Text>

                <Text style={styles.modalMessage}>
                  {selectedNotification.message}
                </Text>

                <Text style={styles.modalTime}>
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </Text>

                <View style={styles.bottomRow}>
                  {selectedNotification.title === "New Generated Image" && (
                    <Pressable
                      onPress={handleGoToAssets}
                      style={styles.goToAssetsBtn}
                    >
                      <Text style={styles.goToAssetsText}>Go to Assets</Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

export default AllNotifications;

/* ----------------- Styles --------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.bodybackground,
  },

  card: {
    backgroundColor: colors.cardsbackground,
    borderRadius: 16,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  unreadCard: {
    borderColor: colors.error,
  },

  headingrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },

  statusText: {
    color: "#fff",
    fontSize: 11,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 50,
  },

  title: {
    fontSize: 15,
    color: colors.primary, fontWeight: '700',
    // marginBottom: 6,
    paddingRight: 0,
  },

  message: {
    fontSize: 14,
    color: colors.mutedText,
  },

  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    textAlign: "right",
  },

  emptyText: {
    textAlign: "center",
    color: colors.mutedText,
    marginTop: 50,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "90%",
    backgroundColor: colors.cardsbackground,
    padding: 20,
    borderRadius: 12,
    position: "relative",
  },

  /* ❌ Floating close icon */
  closeIconWrapper: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.border,
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
  },

  modalMessage: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },

  modalTime: {
    fontSize: 12,
    color: colors.mutedText,
    marginBottom: 15,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  goToAssetsBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  goToAssetsText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
