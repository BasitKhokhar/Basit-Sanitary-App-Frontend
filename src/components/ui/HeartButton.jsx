// HeartButton — wishlist toggle with spring pop + color fill animation.

import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Icon from "@expo/vector-icons/MaterialIcons";
import { colors } from "../../theme/colors";
import { shadows } from "../../theme/shadows";
import { radius } from "../../theme/radius";
import { motion } from "../../theme/motion";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const HeartButton = ({ active = false, onToggle, size = 22, floating = true, style }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      scale.value = withSequence(
        withTiming(1.35, { duration: 120 }),
        withSpring(1, motion.spring.bouncy)
      );
    }
  }, [active]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={active ? "Remove from wishlist" : "Add to wishlist"}
      accessibilityState={{ selected: active }}
      style={[floating && styles.floating, style]}
    >
      <AnimatedIcon
        name={active ? "favorite" : "favorite-border"}
        size={size}
        color={active ? colors.status.error : colors.text.secondary}
        style={iconStyle}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  floating: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.bg.surface,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.e2,
  },
});

export default React.memo(HeartButton);
