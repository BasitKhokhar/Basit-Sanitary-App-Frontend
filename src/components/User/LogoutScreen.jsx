import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { MotiView, AnimatePresence } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const { palette } = colors;

const LogoutScreen = () => {
  const navigation = useNavigation();

  const [showToast, setShowToast] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleCancel = () => {
    if (loggingOut) return;
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("Main");
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      // Clear every credential set at login so the session is truly ended.
      await AsyncStorage.removeItem("userId");
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        navigation.replace("Login");
      }, 1500);
    } catch (error) {
      if (__DEV__) console.error("Error during logout:", error);
      setLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: 24, scale: 0.96 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: "spring", damping: 16, stiffness: 180 }}
        style={styles.card}
      >
        <View style={styles.iconBadge}>
          <Ionicons name="log-out-outline" size={34} color={palette.red} />
        </View>

        <Text style={styles.title}>Log Out</Text>
        <Text style={styles.message}>
          Are you sure you want to log out of your account?
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.85}
            disabled={loggingOut}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmWrapper}
            onPress={handleLogout}
            activeOpacity={0.9}
            disabled={loggingOut}
          >
            <LinearGradient
              colors={[palette.red, "#B5302A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.confirmButton}
            >
              <Ionicons name="log-out-outline" size={18} color={palette.white} />
              <Text style={styles.confirmText}>
                {loggingOut ? "Logging out…" : "Log Out"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </MotiView>

      {/* 🔔 Logout Success Toast Modal */}
      <AnimatePresence>
        {showToast && (
          <MotiView
            style={styles.overlay}
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MotiView
              from={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              style={styles.toastBox}
            >
              <View style={styles.toastIconWrapper}>
                <Ionicons name="checkmark-circle" size={60} color={palette.emerald500} />
              </View>
              <Text style={styles.toastTitle}>Success</Text>
              <Text style={styles.toastMessage}>Logged out successfully</Text>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg.canvas,
    padding: space.xl,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    paddingVertical: space["3xl"],
    paddingHorizontal: space["2xl"],
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.e3,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(224,65,58,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: space.sm,
  },
  message: {
    ...typography.body,
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: space["2xl"],
  },
  actions: {
    flexDirection: "row",
    width: "100%",
    gap: space.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: space.lg,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg.sunken,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  cancelText: {
    ...typography.h3,
    color: colors.text.primary,
  },
  confirmWrapper: {
    flex: 1,
    borderRadius: radius.pill,
    shadowColor: palette.red,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingVertical: space.lg,
    borderRadius: radius.pill,
  },
  confirmText: {
    ...typography.h3,
    color: palette.white,
  },

  // --------- SUCCESS TOAST ----------
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  toastBox: {
    width: "75%",
    maxWidth: 320,
    backgroundColor: colors.bg.surface,
    borderRadius: radius.lg,
    alignItems: "center",
    paddingVertical: space["2xl"],
    paddingHorizontal: space.lg,
    ...shadows.e4,
  },
  toastIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.brand.tint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md,
  },
  toastTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: space.xs,
  },
  toastMessage: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: "center",
  },
});

export default LogoutScreen;
