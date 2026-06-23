// PressableScale — premium spring press feedback for any tappable surface.
// Runs entirely on the UI thread (Reanimated worklets).

import React from "react";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { motion } from "../../theme/motion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PressableScale = ({
  children,
  onPress,
  onLongPress,
  style,
  scaleTo = motion.pressScale,
  disabled = false,
  hitSlop,
  accessibilityLabel,
  accessibilityRole = "button",
  ...rest
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessible
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      onPressIn={() => {
        scale.value = withSpring(scaleTo, motion.spring.stiff);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.spring.gentle);
      }}
      style={[animatedStyle, style]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
};

export default React.memo(PressableScale);
