import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { MotiView, AnimatePresence } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../Themes/colors";

const LogoutScreen = () => {
  const navigation = useNavigation();

  const [showToast, setShowToast] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      await SecureStore.deleteItemAsync("jwt_token");

      // Show success modal
      setShowToast(true);

      // Close after 1.5 sec and redirect
      setTimeout(() => {
        setShowToast(false);
        navigation.replace("Login");
      }, 1500);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout</Text>
      <Text style={styles.text}>Are you sure you want to logout?</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Confirm Logout</Text>
      </TouchableOpacity>

      {/* 🔔 Logout Success Toast Modal */}
      <AnimatePresence>
        {showToast && (
          <MotiView
            style={styles.overlay}
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <View style={styles.toastBox}>
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: "rgba(6,182,212,0.15)" },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={60}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.toastTitle}>Success</Text>
              <Text style={styles.toastMessage}>Logged out successfully</Text>
            </View>
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
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  text: { fontSize: 18, marginBottom: 20, color: "#555" },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
  },
  logoutText: { fontSize: 18, color: "#fff", fontWeight: "bold" },

  // --------- MODAL STYLES (same as Signup screen) ----------
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  toastBox: {
    width: "75%",
    backgroundColor: colors.cardsbackground,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  toastTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  toastMessage: {
    color: colors.mutedText,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default LogoutScreen;
