// TabBar — premium floating bottom tab bar with spring active pill + badges.

import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/MaterialIcons";
import PressableScale from "../ui/PressableScale";
import AppText from "../ui/Text";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";
import { motion } from "../../theme/motion";

const TABS = [
  { name: "Home", icon: "home", label: "Home" },
  { name: "Products", icon: "grid-view", label: "Shop" },
  { name: "Cart", icon: "shopping-bag", label: "Cart" },
  { name: "Services", icon: "build", label: "Services" },
  { name: "Profile", icon: "person", label: "Profile" },
];

const TabItem = ({ tab, active, onPress, badge }) => {
  const pillStyle = useAnimatedStyle(() => ({
    opacity: withTiming(active ? 1 : 0, { duration: motion.duration.fast }),
    transform: [{ scale: withSpring(active ? 1 : 0.6, motion.spring.bouncy) }],
  }));

  const iconLift = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(active ? -2 : 0, motion.spring.gentle) }],
  }));

  return (
    <PressableScale onPress={onPress} style={styles.item} accessibilityLabel={tab.label} scaleTo={0.9}>
      <Animated.View style={[styles.pill, pillStyle]}>
        <LinearGradient
          colors={colors.gradients.emeraldGlow}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View style={[styles.iconWrap, iconLift]}>
        <Icon name={tab.icon} size={22} color={active ? colors.text.onPrimary : colors.text.muted} />
        {badge > 0 ? (
          <View style={styles.badge}>
            <AppText variant="micro" style={{ color: colors.text.onPrimary }} weight="800">
              {badge > 99 ? "99+" : badge}
            </AppText>
          </View>
        ) : null}
      </Animated.View>

      <AppText
        variant="micro"
        weight={active ? "700" : "500"}
        style={{ color: active ? colors.brand.primaryDark : colors.text.muted, marginTop: 2 }}
      >
        {tab.label}
      </AppText>
    </PressableScale>
  );
};

const TabBar = ({ current, onNavigate, cartCount = 0 }) => (
  <View style={styles.wrap}>
    <View style={styles.bar}>
      {TABS.map((tab) => (
        <TabItem
          key={tab.name}
          tab={tab}
          active={current === tab.name}
          onPress={() => onNavigate(tab.name)}
          badge={tab.name === "Cart" ? cartCount : 0}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: space.lg, right: space.lg, bottom: space.lg },
  bar: {
    flexDirection: "row",
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    paddingVertical: space.sm,
    paddingHorizontal: space.xs,
    ...shadows.e4,
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: space.xs },
  pill: {
    position: "absolute",
    top: space.xs,
    width: 46,
    height: 46,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  iconWrap: { width: 46, height: 46, justifyContent: "center", alignItems: "center" },
  badge: {
    position: "absolute",
    top: 2,
    right: 4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.status.error,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.bg.surface,
  },
});

export default TabBar;
