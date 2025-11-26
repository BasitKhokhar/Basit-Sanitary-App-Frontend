import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';  // Import SecureStore
import { useNavigation } from "@react-navigation/native";

const LogoutScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem("userId");

      // Remove JWT token from SecureStore
      await SecureStore.deleteItemAsync("jwt_token");

      // Navigate to the Login screen
      navigation.replace("Login");

      Alert.alert("Success", "Logged out successfully!");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "Logout failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout</Text>
      <Text style={styles.text}>Are you sure you want to logout?</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Confirm Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  text: { fontSize: 18, marginBottom: 20, color: "#555" },
  logoutButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#ff4d4d", borderRadius: 5 },
  logoutText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default LogoutScreen;
