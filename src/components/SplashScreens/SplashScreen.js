import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView, MotiText } from "moti";
import { Easing } from "react-native-reanimated";

import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { space } from "../../theme/spacing";
import { shadows } from "../../theme/shadows";

import splashLogo from "../../../assets/icons.png";

const { palette } = colors;
const { width } = Dimensions.get("window");

const SplashScreen = ({ navigation }) => {
  const fullText = "Welcome to Basit Sanitary";
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 75);

    const timeout = setTimeout(() => {
      navigation.replace("Main");
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[palette.emerald800, palette.emerald900, palette.ink]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft decorative glows */}
      <View pointerEvents="none" style={[styles.glow, styles.glowTop]} />
      <View pointerEvents="none" style={[styles.glow, styles.glowBottom]} />

      <View style={styles.center}>
        {/* Brand mark with pulsing halo */}
        <View style={styles.logoWrap}>
          <MotiView
            from={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 0, scale: 1.7 }}
            transition={{
              type: "timing",
              duration: 2200,
              easing: Easing.out(Easing.ease),
              loop: true,
              repeatReverse: false,
            }}
            style={styles.halo}
          />
          <MotiView
            from={{ opacity: 0, scale: 0.6, translateY: 12 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 14, stiffness: 140, delay: 150 }}
            style={styles.logoCard}
          >
            <Image source={splashLogo} style={styles.logo} resizeMode="contain" />
          </MotiView>
        </View>

        {/* Eyebrow label */}
        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 500 }}
          style={styles.eyebrow}
        >
          PREMIUM SANITARY STORE
        </MotiText>

        {/* Typewriter welcome text with blinking caret */}
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>{displayedText}</Text>
          {!typingDone && (
            <MotiView
              from={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              transition={{ type: "timing", duration: 500, loop: true, repeatReverse: true }}
              style={styles.caret}
            />
          )}
        </View>

        {/* Gold divider */}
        <MotiView
          from={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ type: "timing", duration: 500, delay: 700 }}
          style={styles.divider}
        />

        <MotiText
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 850 }}
          style={styles.tagline}
        >
          Premium Bathroom & Sanitary Solutions
        </MotiText>

        {/* Animated loading dots */}
        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <MotiView
              key={i}
              from={{ opacity: 0.25, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "timing",
                duration: 600,
                loop: true,
                repeatReverse: true,
                delay: 1100 + i * 180,
              }}
              style={styles.dot}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const LOGO_BOX = 118;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.emerald900,
  },
  glow: {
    position: "absolute",
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width,
  },
  glowTop: {
    top: -width * 0.35,
    right: -width * 0.3,
    backgroundColor: palette.emerald500,
    opacity: 0.18,
  },
  glowBottom: {
    bottom: -width * 0.4,
    left: -width * 0.3,
    backgroundColor: palette.emerald700,
    opacity: 0.22,
  },
  center: {
    alignItems: "center",
    paddingHorizontal: space.xl,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space["3xl"],
  },
  halo: {
    position: "absolute",
    width: LOGO_BOX,
    height: LOGO_BOX,
    borderRadius: LOGO_BOX / 2,
    borderWidth: 2,
    borderColor: palette.emerald200,
  },
  logoCard: {
    width: LOGO_BOX,
    height: LOGO_BOX,
    borderRadius: LOGO_BOX / 2,
    backgroundColor: palette.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.e4,
  },
  logo: {
    width: LOGO_BOX * 0.62,
    height: LOGO_BOX * 0.62,
    borderRadius: LOGO_BOX * 0.31,
  },
  eyebrow: {
    ...typography.micro,
    color: palette.gold,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: space.md,
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 84,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "800",
    color: palette.white,
    textAlign: "center",
    letterSpacing: 0.4,
    lineHeight: 40,
  },
  caret: {
    width: 3,
    height: 30,
    borderRadius: 2,
    backgroundColor: palette.gold,
    marginLeft: 4,
  },
  divider: {
    width: 56,
    height: 3,
    borderRadius: 2,
    backgroundColor: palette.gold,
    marginTop: space.lg,
    marginBottom: space.lg,
  },
  tagline: {
    ...typography.bodyLg,
    color: palette.emerald100,
    opacity: 0.85,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  dots: {
    flexDirection: "row",
    marginTop: space["3xl"],
    gap: space.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.emerald200,
  },
});

export default SplashScreen;
