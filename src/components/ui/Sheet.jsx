// Sheet — bottom-sheet modal with blur backdrop + spring slide-up.

import React, { useEffect } from "react";
import { Modal, View, Pressable, StyleSheet, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import Icon from "@expo/vector-icons/MaterialIcons";
import AppText from "./Text";
import PressableScale from "./PressableScale";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";
import { motion } from "../../theme/motion";

const { height: SCREEN_H } = Dimensions.get("window");

const Sheet = ({ visible, onClose, title, children, maxHeightRatio = 0.85 }) => {
  const translateY = useSharedValue(SCREEN_H);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      backdrop.value = withTiming(1, { duration: motion.duration.base });
      translateY.value = withSpring(0, motion.spring.gentle);
    }
  }, [visible]);

  const close = () => {
    backdrop.value = withTiming(0, { duration: motion.duration.fast });
    translateY.value = withTiming(SCREEN_H, { duration: motion.duration.base }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  };

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={close} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
          <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
          <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close" />
        </Animated.View>

        <Animated.View style={[styles.sheet, { maxHeight: SCREEN_H * maxHeightRatio }, shadows.e4, sheetStyle]}>
          <View style={styles.grabber} />
          <View style={styles.headerRow}>
            <AppText variant="h3">{title}</AppText>
            <PressableScale onPress={close} accessibilityLabel="Close" style={styles.closeBtn}>
              <Icon name="close" size={20} color={colors.text.primary} />
            </PressableScale>
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.bg.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: space.xl,
    paddingBottom: space["3xl"],
    paddingTop: space.md,
  },
  grabber: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border.strong,
    marginBottom: space.md,
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.lg },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.bg.sunken,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Sheet;
