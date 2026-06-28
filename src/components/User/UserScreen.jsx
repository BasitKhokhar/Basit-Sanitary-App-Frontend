import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  Modal,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import SocialIconsRow from "./SocialIconsRow";
import { apiFetch } from "../../apiFetch";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

import { CartContext } from "../../ContextApis/cartContext";
import { useWishlist } from "../../ContextApis/WishlistContext";
import AppText from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const UserScreen = () => {
  const navigation = useNavigation();
  const { cartCount } = useContext(CartContext);
  const { count: wishlistCount } = useWishlist();

  const [userData, setUserData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        const response = await apiFetch(`/users/getuserdetails`);
        const data = await response.json();
        setUserData(data);

        const imageResponse = await apiFetch(`/users/user_images`);
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setUserImage(imageData.image_url);
        }
      }
    } catch (error) {
      if (__DEV__) console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUserData(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const handleOpenPdf = async (id) => {
    setShowLoader(true);
    const res = await apiFetch(`/content/pdf-files/${id}`);
    setShowLoader(false);
    if (res?.url) Linking.openURL(res.url);
    else alert("PDF not found");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["userId", "email", "hasSeenGuide", "hasSeenSearchHeaderTour"]);
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      setShowLogoutModal(false);
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      if (__DEV__) console.log("Logout Error:", error);
    }
  };

  const quickStats = [
    { label: "Orders", icon: "receipt-long", onPress: () => navigation.navigate("Orders") },
    { label: "Wishlist", icon: "favorite", value: wishlistCount, onPress: () => navigation.navigate("Wishlist") },
    { label: "Cart", icon: "shopping-bag", value: cartCount, onPress: () => navigation.navigate("Main") },
  ];

  const menu = [
    { label: "My Orders", icon: "receipt-long", onPress: () => navigation.navigate("Orders") },
    { label: "My Wishlist", icon: "favorite-border", onPress: () => navigation.navigate("Wishlist") },
    { label: "Account Detail", icon: "person-outline", onPress: () => navigation.navigate("AccountDetail", { userData }) },
    { label: "Customer Support", icon: "support-agent", onPress: () => navigation.navigate("CustomerSupport") },
    { label: "FAQs", icon: "help-outline", onPress: () => navigation.navigate("faq") },
    { label: "About App", icon: "info-outline", onPress: () => handleOpenPdf(1) },
    { label: "Privacy Policy", icon: "security", onPress: () => handleOpenPdf(2) },
  ];

  return (
    <View style={styles.container}>
      {showLoader && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderBox}>
            <AppText variant="body" color="secondary">Please wait…</AppText>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.brand.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        {loading ? (
          <Skeleton height={120} rounded={radius.xl} style={{ marginBottom: space.lg }} />
        ) : (
          <Card style={styles.profileCard}>
            <View style={styles.avatar}>
              {userImage && userImage.startsWith("http") ? (
                <Image source={{ uri: userImage }} style={styles.avatarImg} onError={() => setUserImage(null)} />
              ) : (
                <Icon name="person" size={32} color={colors.brand.primary} />
              )}
            </View>
            <View style={{ flex: 1, marginLeft: space.lg }}>
              <AppText variant="caption" color="muted">Welcome back</AppText>
              <AppText variant="h3" numberOfLines={1}>{userData?.name || userData?.email || "Guest User"}</AppText>
            </View>
          </Card>
        )}

        {/* Quick stats */}
        <View style={styles.statsRow}>
          {quickStats.map((s) => (
            <Pressable key={s.label} style={styles.stat} onPress={s.onPress} accessibilityRole="button">
              <View style={styles.statIcon}>
                <Icon name={s.icon} size={20} color={colors.brand.primary} />
                {s.value > 0 ? (
                  <View style={styles.statBadge}>
                    <AppText variant="micro" weight="800" style={{ color: colors.text.onPrimary }}>{s.value}</AppText>
                  </View>
                ) : null}
              </View>
              <AppText variant="caption" color="secondary" weight="600" style={{ marginTop: space.xs }}>{s.label}</AppText>
            </Pressable>
          ))}
        </View>

        {/* Menu */}
        <Card padded={false} style={styles.menuCard}>
          {menu.map((item, i) => (
            <Pressable
              key={item.label}
              style={[styles.menuRow, i < menu.length - 1 && styles.menuDivider]}
              onPress={item.onPress}
              accessibilityRole="button"
            >
              <View style={styles.menuIcon}>
                <Icon name={item.icon} size={20} color={colors.brand.primaryDark} />
              </View>
              <AppText variant="bodyLg" style={{ flex: 1 }}>{item.label}</AppText>
              <Icon name="chevron-right" size={22} color={colors.text.muted} />
            </Pressable>
          ))}
        </Card>

        <Button
          title="Logout"
          variant="ghost"
          icon="logout"
          onPress={() => setShowLogoutModal(true)}
          style={{ marginTop: space.xl, borderColor: colors.status.error }}
        />

        <View style={styles.socials}>
          <SocialIconsRow />
        </View>
      </ScrollView>

      {/* Logout modal */}
      <Modal transparent visible={showLogoutModal} animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <AppText variant="h3">Confirm Logout</AppText>
            <AppText variant="body" color="secondary" style={{ marginTop: space.sm, marginBottom: space.xl }}>
              Are you sure you want to logout?
            </AppText>
            <View style={styles.modalButtons}>
              <View style={{ flex: 1, marginRight: space.sm }}>
                <Button title="Cancel" variant="secondary" onPress={() => setShowLogoutModal(false)} />
              </View>
              <View style={{ flex: 1, marginLeft: space.sm }}>
                <Button title="Logout" variant="danger" onPress={handleLogout} />
              </View>
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.canvas },
  scroll: { padding: space.lg, paddingBottom: 120 },
  profileCard: { flexDirection: "row", alignItems: "center", marginBottom: space.lg },
  avatar: {
    width: 60, height: 60, borderRadius: radius.pill,
    backgroundColor: colors.brand.tint, justifyContent: "center", alignItems: "center", overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: space.lg, gap: space.md },
  stat: {
    flex: 1, alignItems: "center", paddingVertical: space.lg,
    backgroundColor: colors.bg.surface, borderRadius: radius.lg, ...shadows.e1,
  },
  statIcon: { width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.brand.tint, justifyContent: "center", alignItems: "center" },
  statBadge: {
    position: "absolute", top: -4, right: -6, minWidth: 18, height: 18, paddingHorizontal: 4,
    borderRadius: radius.pill, backgroundColor: colors.status.error, justifyContent: "center", alignItems: "center",
  },
  menuCard: { overflow: "hidden" },
  menuRow: { flexDirection: "row", alignItems: "center", paddingVertical: space.lg, padding: space.lg },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: colors.border.subtle },
  menuIcon: {
    width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.bg.sunken,
    justifyContent: "center", alignItems: "center", marginRight: space.md,
  },
  socials: { marginTop: space.xl, alignItems: "center" },
  loaderOverlay: {
    position: "absolute", width: "100%", height: "100%",
    backgroundColor: "rgba(12,26,20,0.5)", zIndex: 999, justifyContent: "center", alignItems: "center",
  },
  loaderBox: { backgroundColor: colors.bg.surface, padding: space.xl, borderRadius: radius.lg, alignItems: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(12,26,20,0.55)", justifyContent: "center", alignItems: "center", padding: space.xl },
  modalContent: { width: "100%" },
  modalButtons: { flexDirection: "row" },
});

export default UserScreen;
