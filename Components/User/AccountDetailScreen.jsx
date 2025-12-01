import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, TextInput, ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { apiFetch } from "../../src/apiFetch";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import { colors } from "../Themes/colors";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const AccountDetailScreen = ({ route, navigation }) => {
  const { userData } = route.params;

  const [name, setName] = useState(userData.name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // --- Image Picker ---
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) uploadImageToFirebase(result.assets[0].uri);
  };

  // --- Upload to Firebase Storage ---
  const uploadImageToFirebase = async (uri) => {
    try {
      setShowLoader(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = await AsyncStorage.getItem("userId");
      const fileRef = ref(storage, `CardifyProfileImages/${userId}.jpg`);
      await uploadBytes(fileRef, blob);
      const imageUrl = await getDownloadURL(fileRef);
      await saveImageUrlToDatabase(userId, imageUrl);
      setShowLoader(false);
      showToastMessage("Profile image uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload Error:", error);
      setShowLoader(false);
      showToastMessage("Failed to upload image.");
    }
  };

  // --- Save image URL to backend ---
  const saveImageUrlToDatabase = async ( imageUrl) => {
    await apiFetch(
      `/users/upload-profile-image`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({image_url: imageUrl }),
      },
      navigation
    );
  };

  // --- Update user details ---
  const updateUserDetails = async () => {
    try {
      setShowLoader(true);
      const response = await apiFetch(
        `/users/updateuser`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone }),
        },
        navigation
      );
      setShowLoader(false);
      if (response.ok) {
        showToastMessage("Profile updated successfully!");
      } else {
        const result = await response.json();
        showToastMessage(result.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("❌ Update Error:", error);
      setShowLoader(false);
      showToastMessage("Something went wrong while updating profile.");
    }
  };

  // --- Toast Handler ---
  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bodybackground }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.formContainer, { backgroundColor: colors.cardsbackground }]}>
          <Text style={styles.title}>Profile Settings</Text>
          <Text style={styles.subtitle}>
            Manage and update your Cardify-AI profile
          </Text>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor={colors.mutedText}
              style={styles.input}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor={colors.mutedText}
              style={styles.input}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              keyboardType="phone-pad"
              placeholderTextColor={colors.mutedText}
              style={styles.input}
            />
          </View>

          {/* Upload Button */}
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            style={[styles.simpleButton, uploading && { opacity: 0.7 }]}
            disabled={uploading}
          >
            <Text style={styles.simpleButtonText}>
              {uploading ? "Uploading..." : "Upload Profile Image"}
            </Text>
          </TouchableOpacity>

          {/* Update Button */}
          <TouchableOpacity
            onPress={updateUserDetails}
            activeOpacity={0.9}
            style={[styles.buttonWrapper, { marginTop: 45 }]}
            disabled={updating}
          >
            <LinearGradient
              colors={colors.gradients.ocean}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              {updating ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Text style={styles.buttonText}>Update Details</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🔄 Loader Modal */}
      <AnimatePresence>
        {showLoader && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 300 }}
            style={styles.confirmationOverlay}
          >
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "timing", duration: 400 }}
              style={[styles.loaderBox, { backgroundColor: colors.cardsbackground }]}
            >
              <MotiView
                from={{ rotate: "0deg" }}
                animate={{ rotate: "360deg" }}
                transition={{ loop: true, type: "timing", duration: 1200 }}
                style={[styles.loaderRing, { borderTopColor: colors.primary }]}
              />
              <Text style={styles.loaderText}>Please wait...</Text>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>

      {/* ✅ Toast Modal */}
      <AnimatePresence>
        {showToast && (
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "timing", duration: 400 }}
            style={styles.confirmationOverlay}
          >
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 400, delay: 150 }}
              style={[styles.confirmationBox, { backgroundColor: colors.cardsbackground }]}
            >
              <View style={[styles.iconWrapper, { backgroundColor: "rgba(6,182,212,0.15)" }]}>
                <Ionicons
                  name={
                    toastMessage.includes("fail") || toastMessage.includes("wrong")
                      ? "close-circle"
                      : "checkmark-circle"
                  }
                  size={60}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.confirmationTitle}>Done</Text>
              <Text style={styles.confirmationText}>
                {toastMessage}
              </Text>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

export default AccountDetailScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, padding: 20 },
  formContainer: {
    padding: 25,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: colors.mutedText,
    textAlign: "center",
    marginBottom: 25,
    fontSize: 14,
  },
  inputGroup: { marginBottom: 15 },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.secondary,
  },
  simpleButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.cardsbackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  simpleButtonText: {
    color: colors.text,
    fontSize: 16,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 12,
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontSize: 17,
  },
  confirmationOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  loaderBox: {
    width: 140,
    height: 140,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  loaderRing: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: colors.border,
    marginBottom: 12,
  },
  loaderText: {
    color: colors.text,
    fontSize: 15,
  },
  confirmationBox: {
    width: "75%",
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
  confirmationTitle: {
    color: colors.text,
    fontSize: 20,
    marginBottom: 6,
  },
  confirmationText: {
    color: colors.mutedText,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
