import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/MaterialIcons";
import DateTimeDisplay from "./DateTimeDisplay";
import { apiFetch } from "../../apiFetch";
import AppText from "../../components/ui/Text";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";

const UserNameDisplay = () => {
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiFetch(`/users/getuserdetails`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setUserName(data.name);

        const imageResponse = await apiFetch(`/users/user_images`);
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setUserImage(imageData.image_url);
        }
      } catch (error) {
        if (__DEV__) console.error("❌ Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <LinearGradient
      colors={colors.gradients.dark}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" style={styles.eyebrow}>
            {userName ? "Welcome back" : "Welcome"}
          </AppText>
          <AppText variant="h1" style={styles.name} numberOfLines={1}>
            {userName ? `${userName} 👋` : "Loading…"}
          </AppText>
        </View>

        <View style={styles.avatarRing}>
          {userImage ? (
            <Image source={{ uri: userImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Icon name="person" size={24} color={colors.text.onPrimary} />
            </View>
          )}
        </View>
      </View>

      <AppText variant="body" style={styles.subtitle}>
        Explore a wide range of sanitary products and expert plumbing services.
      </AppText>

      <View style={styles.dateChip}>
        <Icon name="schedule" size={14} color={colors.brand.primaryLight} />
        <View style={styles.dateChipInner}>
          <DateTimeDisplay />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space["2xl"],
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  header: { flexDirection: "row", alignItems: "center" },
  eyebrow: {
    color: colors.brand.primaryLight,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  name: { color: colors.text.onPrimary, marginTop: 2 },
  subtitle: {
    color: "rgba(255,255,255,0.72)",
    marginTop: space.md,
    lineHeight: 22,
  },
  avatarRing: {
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    padding: 2,
    borderWidth: 2,
    borderColor: "rgba(63,182,131,0.55)",
    overflow: "hidden",
  },
  profileImage: { width: "100%", height: "100%", borderRadius: radius.pill },
  avatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: space.lg,
    paddingVertical: space.xs,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  dateChipInner: { marginLeft: space.xs },
});

export default UserNameDisplay;
