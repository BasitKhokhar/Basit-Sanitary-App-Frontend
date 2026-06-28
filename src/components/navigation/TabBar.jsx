// TabBar — premium "chrome pipe" bottom bar for a sanitary / plumbing brand.
// The bar is styled as a polished chrome water pipe (brushed-steel cylinder with
// a top reflection + joint seams). The active tab is a glowing emerald "water
// valve" knob that springs along the pipe like a slider on a fixture rail.

import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
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
  { name: "Products", icon: "storefront", label: "Shop" },
  { name: "Cart", icon: "shopping-bag", label: "Cart" },
  { name: "Services", icon: "plumbing", label: "Services" },
  { name: "Profile", icon: "person", label: "Profile" },
];

const BAR_HEIGHT = 64;
const KNOB = 52;

// The bar is re-mounted on every tab change (each screen renders its own MainLayout +
// TabBar). Remembering the last active index at module scope lets a freshly-mounted bar
// start the valve knob where the previous screen's knob actually was, then spring to the
// current tab — so the slide reads "previous → next" instead of jumping from the far left.
let lastActiveIndex = 0;

// Brushed-chrome cylinder: top highlight -> body -> bottom shade gives the pipe
// its rounded, metallic feel.
const CHROME = ["#FFFFFF", colors.palette.mist, colors.palette.slate200, colors.palette.slate300];

const TabItem = ({ tab, active, onPress, badge }) => {
  const lift = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(active ? -2 : 0, motion.spring.gentle) }],
  }));

  return (
    <PressableScale
      onPress={onPress}
      style={styles.item}
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: active }}
      scaleTo={0.9}
    >
      <Animated.View style={[styles.iconWrap, lift]}>
        {/* Active icon lives on the sliding valve knob, so hide it here. */}
        <Icon
          name={tab.icon}
          size={23}
          color={colors.text.secondary}
          style={{ opacity: active ? 0 : 1 }}
        />
        {badge > 0 ? (
          <View style={styles.badge}>
            <AppText variant="micro" weight="800" style={{ color: colors.text.onPrimary }}>
              {badge > 99 ? "99+" : badge}
            </AppText>
          </View>
        ) : null}
      </Animated.View>

      <AppText
        variant="micro"
        weight={active ? "800" : "600"}
        numberOfLines={1}
        style={{
          color: active ? colors.brand.primaryDark : colors.text.muted,
          marginTop: 4,
          letterSpacing: 0.3,
          // Keep the label above the chrome but below the floating knob's z-layer so the
          // text always reads clearly and never sits hidden behind the emerald circle.
          zIndex: 1,
        }}
      >
        {tab.label}
      </AppText>
    </PressableScale>
  );
};

const TabBar = ({ current, onNavigate, cartCount = 0 }) => {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, space.md) + space.xs;

  const [rowW, setRowW] = useState(0);
  const activeIndex = Math.max(0, TABS.findIndex((t) => t.name === current));
  const itemW = rowW / TABS.length;

  // Centered x of the knob for a given tab index.
  const knobX = (i) => i * itemW + itemW / 2 - KNOB / 2;

  // Slide the valve knob to sit centered under the active tab.
  const tx = useSharedValue(0);
  const opacity = useSharedValue(0);
  const placed = useRef(false);

  useEffect(() => {
    if (!rowW) return;
    const target = knobX(activeIndex);

    if (!placed.current) {
      // First layout of this mounted bar: drop the knob where it was on the previous
      // screen, then spring to the current tab so the transition slides continuously.
      tx.value = knobX(lastActiveIndex);
      tx.value = withSpring(target, motion.spring.gentle);
      opacity.value = withTiming(1, { duration: 140 });
      placed.current = true;
    } else {
      // Same instance still mounted (e.g. tab tapped without remount) — just glide over.
      tx.value = withSpring(target, motion.spring.gentle);
    }

    lastActiveIndex = activeIndex;
  }, [activeIndex, rowW, itemW]);

  const knobStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: tx.value }],
  }));

  const activeTab = TABS[activeIndex];

  return (
    <View style={[styles.wrap, { bottom }]}>
      <View style={styles.pipe}>
        {/* Clipped chrome body (rounded) — kept separate so the valve knob can
            protrude above the pipe without being clipped. */}
        <View style={styles.clip}>
          <LinearGradient
            colors={CHROME}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Glossy reflection running along the top of the cylinder. */}
          <View style={styles.reflection} />
          {/* Joint seams hint at pipe couplings near each end. */}
          <View style={[styles.seam, { left: "16%" }]} />
          <View style={[styles.seam, { right: "16%" }]} />
        </View>

        {/* Tab targets + labels. */}
        <View
          style={styles.row}
          onLayout={(e) => setRowW(e.nativeEvent.layout.width)}
        >
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

        {/* Emerald "water valve" — the active indicator that slides along the pipe. */}
        {rowW > 0 ? (
          <Animated.View style={[styles.knob, knobStyle]}>
            <View style={styles.knobBezel}>
              <LinearGradient
                colors={colors.gradients.emeraldGlow}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={styles.knobFill}
              >
                {/* Wet-look highlight on the valve. */}
                <View style={styles.knobShine} />
                <Icon name={activeTab.icon} size={24} color={colors.text.onPrimary} />
              </LinearGradient>
            </View>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: space.lg, right: space.lg },
  pipe: {
    height: BAR_HEIGHT,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.palette.slate300,
    backgroundColor: colors.palette.mist,
    ...shadows.e4,
  },
  clip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  reflection: {
    position: "absolute",
    top: 3,
    left: 14,
    right: 14,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  seam: {
    position: "absolute",
    top: 10,
    bottom: 10,
    width: 1,
    backgroundColor: "rgba(108,123,116,0.25)",
  },
  row: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center", height: "100%" },
  iconWrap: { width: 46, height: 30, justifyContent: "center", alignItems: "center" },
  badge: {
    position: "absolute",
    top: -4,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.status.error,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.palette.white,
    zIndex: 2,
  },
  // Valve knob slides on this absolute layer; sits raised above the pipe top so it
  // floats clear of the tab label sitting at the bottom of the bar.
  knob: {
    position: "absolute",
    top: (BAR_HEIGHT - KNOB) / 2 - 20,
    left: 0,
    width: KNOB,
    height: KNOB,
  },
  knobBezel: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    padding: 3,
    backgroundColor: colors.palette.white,
    ...shadows.brand,
  },
  knobFill: {
    flex: 1,
    borderRadius: KNOB / 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  knobShine: {
    position: "absolute",
    top: 6,
    left: 10,
    width: 20,
    height: 9,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
});

export default TabBar;
