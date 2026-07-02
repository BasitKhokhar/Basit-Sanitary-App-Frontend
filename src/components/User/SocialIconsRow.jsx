import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Animated,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { apiFetch } from "../../apiFetch";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const { palette } = colors;

// Map backend icon class -> FontAwesome5 name + brand gradient for a vivid look.
const iconMap = {
  "fa-brands fa-facebook": { name: "facebook", gradient: ["#1877F2", "#0D5FCC"] },
  "fa-brands fa-facebook-messenger": { name: "facebook-messenger", gradient: ["#00B2FF", "#006AFF"] },
  "fa-brands fa-tiktok": { name: "tiktok", gradient: ["#2B2B2B", "#000000"] },
  "fa-brands fa-linkedin": { name: "linkedin-in", gradient: ["#0A66C2", "#004182"] },
  "fa-brands fa-instagram": { name: "instagram", gradient: ["#F58529", "#DD2A7B"] },
  "fa-brands fa-whatsapp": { name: "whatsapp", gradient: ["#25D366", "#128C7E"] },
  "fa-brands fa-youtube": { name: "youtube", gradient: ["#FF0000", "#C4302B"] },
};

const SocialIcon = ({ item }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const iconData = iconMap[item.icons] || { name: "globe", gradient: colors.gradients.emeraldGlow };

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  const handlePress = () =>
    Linking.openURL(item.routes).catch((err) => console.error("Error opening URL:", err));

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
      >
        <LinearGradient
          colors={iconData.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCard}
        >
          <FontAwesome5 name={iconData.name} size={22} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SocialIconsRow = () => {
  const [socialIcons, setSocialIcons] = useState([]);

  useEffect(() => {
    apiFetch(`/content/socialicons`)
      .then((response) => response.json())
      .then((data) => setSocialIcons(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching social icons:", error));
  }, []);

  if (!socialIcons.length) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.accent} />
        <Text style={styles.title}>Connect With Us</Text>
      </View>
      <Text style={styles.subtitle}>
        Follow Basit Sanitary for offers, new arrivals & updates
      </Text>

      <View style={styles.row}>
        {socialIcons.map((item, index) => (
          <SocialIcon key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    padding: space.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...shadows.e2,
  },
  header: { flexDirection: "row", alignItems: "center" },
  accent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: palette.gold,
    marginRight: space.sm,
  },
  title: { ...typography.h3, color: colors.text.primary },
  subtitle: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: space.xs,
    marginBottom: space.lg,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: space.md,
  },
  iconCard: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.e2,
  },
});

export default SocialIconsRow;
