
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
import { colors } from "../../Themes/colors";
import { fonts } from "../../Themes/fonts";
import { apiFetch } from "../../apiFetch";
import { useGeneration } from "../../Context/ImageGenerationContext";
import { useNavigation } from "@react-navigation/native";

function AllNotifications() {
  const navigation = useNavigation();
  const {
    notifications,
    fetchNotifications,
    page,
    hasMore,
    setLoadingMore,
    loadingMore,
  } = useGeneration();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loadingRead, setLoadingRead] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // ✅ Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications(1, false);
    setRefreshing(false);
  };

  // ✅ Infinite scroll handler
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchNotifications(page + 1, true);
    setLoadingMore(false);
  }, [loadingMore, hasMore, page]);

  // ✅ Mark as read
  const markAsRead = async (id) => {
    try {
      setLoadingRead(true);
      await apiFetch(`/notifications/mark-as-read/${id}`, { method: "PUT" });
      await fetchNotifications(1, false);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    } finally {
      setLoadingRead(false);
    }
  };

  // ✅ On press
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

  // ✅ Render card
  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.headingrow}>
        <Text style={styles.title}>{item.title}</Text>
       <View>
           <Text
            style={[
              styles.statusText,
              {
                backgroundColor: item.isRead
                  ? colors.border
                  : colors.error,
              },
            ]}
          >
            {item.isRead ? "Seen" : "Unseen"}
          </Text>
        </View>
      </View>
      <Text style={styles.message} numberOfLines={2}>
        {item.message}
      </Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
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

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            {selectedNotification && (
              <>
                <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                <Text style={styles.modalMessage}>
                  {selectedNotification.message}
                </Text>
                <Text style={styles.modalTime}>
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </Text>

                <View style={styles.bottomRow}>
                  {loadingRead ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Pressable onPress={handleCloseModal} style={styles.closeButton}>
                      <Text style={styles.closeText}>Close</Text>
                    </Pressable>
                  )}

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


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.bodybackground },

  card: {
    backgroundColor: colors.cardsbackground,
    borderRadius: 16,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },
  headingrow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: fonts.body,
    borderRadius: 50,
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontWeight: "600",
  },
  title: {
    fontSize: 15,
    color: colors.primary,
    fontFamily: fonts.heading,
    marginBottom: 6,
    paddingRight: 60, // avoid overlap with badge
  },
  message: {
    fontSize: 14,
    color: colors.mutedText,
    fontFamily: fonts.body,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    textAlign: "right",
    fontFamily: fonts.light,
  },
  emptyText: {
    textAlign: "center",
    color: colors.mutedText,
    marginTop: 50,
    fontFamily: fonts.body,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: colors.cardsbackground,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.primary,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.mutedText,
    marginBottom: 12,
  },
  bottomRow: {
    marginTop:25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTime: {
    fontSize: 12,
    color: colors.text,textAlign:'right',
    fontFamily: fonts.light,
  },
  goToAssetsBtn: {
    // backgroundColor: colors.primary,
    borderWidth: 1, borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  goToAssetsText: {
    color: "#fff",
    fontFamily: fonts.heading,
    fontSize: 13,
  },
  closeButton: {
    // marginTop: 20,
    backgroundColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  closeText: {
    color: "#fff",
    fontFamily: fonts.heading,
    fontSize: 14,
  },
});

