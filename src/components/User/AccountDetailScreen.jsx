import React, { useState } from "react";
import {
  View, StyleSheet, TouchableOpacity, Image, ScrollView, Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { apiFetch } from "../../apiFetch";
import Icon from "@expo/vector-icons/MaterialIcons";
import { MotiView, AnimatePresence } from "moti";

import AppText from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import InputField from "../../components/ui/InputField";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const AccountDetailScreen = ({ route, navigation }) => {
  const { userData } = route.params;

  const [name, setName] = useState(userData.name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [image, setImage] = useState(userData.image_url || userData.image || null);
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
      setImage(uri); // optimistic local preview

      // Convert local URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Get user ID
      const userId = await AsyncStorage.getItem("userId");

      // Create a storage reference
      const fileRef = ref(storage, `CardifyProfileImages/${userId}.jpg`);

      // Upload the file
      await uploadBytes(fileRef, blob);

      // Get the download URL
      const imageUrl = await getDownloadURL(fileRef);

      // --- Debug log to check what is sent to backend ---
      console.log("💾 Firebase Image URL to send to backend:", imageUrl);

      // Save URL to backend
      await saveImageUrlToDatabase(userId, imageUrl);

      setImage(imageUrl);
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

  const hasImage = image && String(image).length > 0;
  const isError =
    toastMessage.toLowerCase().includes("fail") ||
    toastMessage.toLowerCase().includes("wrong");

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium gradient hero */}
        <LinearGradient
          colors={colors.gradients.emeraldDeep}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <AppText variant="h2" color="onPrimary" align="center">
            Profile Settings
          </AppText>
          <AppText
            variant="caption"
            color="onPrimary"
            align="center"
            style={styles.heroSubtitle}
          >
            Manage your personal information & photo
          </AppText>
        </LinearGradient>

        {/* Avatar overlapping the hero */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              {hasImage && String(image).startsWith("http") ? (
                <Image
                  source={{ uri: image }}
                  style={styles.avatarImg}
                  onError={() => setImage(null)}
                />
              ) : hasImage ? (
                <Image source={{ uri: image }} style={styles.avatarImg} />
              ) : (
                <Icon name="person" size={48} color={colors.brand.primary} />
              )}
            </View>
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.85}
              disabled={uploading}
              style={styles.cameraBadge}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <Icon name="photo-camera" size={18} color={colors.text.onPrimary} />
            </TouchableOpacity>
          </View>

          <AppText variant="h3" align="center" numberOfLines={1} style={styles.nameText}>
            {name || "Your Name"}
          </AppText>
          {email ? (
            <AppText variant="caption" color="muted" align="center">
              {email}
            </AppText>
          ) : null}
        </View>

        {/* Form card */}
        <Card elevation="e2" style={styles.formCard}>
          <InputField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            icon="person-outline"
            autoCapitalize="words"
          />
          <InputField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone"
            icon="phone"
            keyboardType="phone-pad"
            style={{ marginBottom: space.xl }}
          />

          <Button
            title="Update Details"
            icon="check-circle"
            onPress={updateUserDetails}
            loading={updating || showLoader}
            disabled={updating}
          />
        </Card>
      </ScrollView>

      {/* 🔄 Loader Modal */}
      <AnimatePresence>
        {showLoader && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 300 }}
            style={styles.overlay}
          >
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "timing", duration: 400 }}
              style={styles.loaderBox}
            >
              <MotiView
                from={{ rotate: "0deg" }}
                animate={{ rotate: "360deg" }}
                transition={{ loop: true, type: "timing", duration: 1200 }}
                style={styles.loaderRing}
              />
              <AppText variant="body" color="secondary" style={{ marginTop: space.md }}>
                Please wait…
              </AppText>
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
            style={styles.overlay}
          >
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 400, delay: 150 }}
              style={styles.confirmationBox}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: isError ? "rgba(224,65,58,0.12)" : colors.brand.tint },
                ]}
              >
                <Icon
                  name={isError ? "error-outline" : "check-circle"}
                  size={56}
                  color={isError ? colors.status.error : colors.brand.primary}
                />
              </View>
              <AppText variant="h3" style={{ marginBottom: space.xs }}>
                {isError ? "Oops" : "Done"}
              </AppText>
              <AppText variant="body" color="secondary" align="center">
                {toastMessage}
              </AppText>
            </MotiView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

export default AccountDetailScreen;

const AVATAR = 104;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg.canvas },
  scroll: { paddingBottom: 90 },
  hero: {
    paddingTop: space["3xl"],
    paddingBottom: space["5xl"] + space.xl,
    paddingHorizontal: space.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    ...shadows.e3,
  },
  heroSubtitle: { marginTop: space.xs, opacity: 0.85 },

  avatarWrap: {
    alignItems: "center",
    marginTop: -(AVATAR / 2 + space.xs),
    marginBottom: space.xl,
  },
  avatarRing: {
    width: AVATAR + 8,
    height: AVATAR + 8,
    borderRadius: radius.pill,
    backgroundColor: colors.bg.surface,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.e3,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: radius.pill,
    backgroundColor: colors.brand.tint,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.brand.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: colors.bg.surface,
    ...shadows.brand,
  },
  nameText: { marginTop: space.md },

  formCard: { marginHorizontal: space.xl },

  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(12,26,20,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  loaderBox: {
    width: 150,
    height: 150,
    borderRadius: radius.xl,
    backgroundColor: colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.e4,
  },
  loaderRing: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    borderWidth: 4,
    borderColor: colors.border.subtle,
    borderTopColor: colors.brand.primary,
  },
  confirmationBox: {
    width: "78%",
    borderRadius: radius.xl,
    backgroundColor: colors.bg.surface,
    alignItems: "center",
    paddingVertical: space["2xl"],
    paddingHorizontal: space.xl,
    ...shadows.e4,
  },
  iconWrapper: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md,
  },
});
