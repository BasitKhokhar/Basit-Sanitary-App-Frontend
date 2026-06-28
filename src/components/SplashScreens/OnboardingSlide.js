import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const { palette } = colors;
const { height } = Dimensions.get("window");

const OnboardingSlide = ({
  image,
  eyebrow,
  title,
  description,
  ctaLabel = "Next",
  step = 1,
  total = 4,
  isLast = false,
  onNext,
  onSkip,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {/* Imagery */}
      <View style={styles.imageContainer}>
        <ImageBackground source={image} style={styles.image}>
          {/* Top scrim for status bar + skip legibility */}
          <LinearGradient
            colors={["rgba(0,0,0,0.45)", "transparent"]}
            style={styles.topScrim}
          />
          {/* Bottom fade into the sheet */}
          <LinearGradient
            colors={["transparent", "rgba(12,26,20,0.55)", palette.ink]}
            locations={[0, 0.6, 1]}
            style={styles.bottomScrim}
          />
        </ImageBackground>

        {!isLast && onSkip ? (
          <TouchableOpacity
            style={[styles.skipButton, { top: Math.max(insets.top, space.lg) + space.sm }]}
            onPress={onSkip}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="chevron-forward" size={14} color={palette.white} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Content sheet */}
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, space.lg) + space["2xl"] }]}>
        <MotiView
          from={{ opacity: 0, translateY: 24 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 120 }}
        >
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </MotiView>

        {/* Progress + CTA */}
        <View style={styles.footer}>
          <View style={styles.dots}>
            {Array.from({ length: total }).map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === step - 1 && styles.dotActive]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={onNext} activeOpacity={0.9} style={styles.ctaWrapper}>
            <LinearGradient
              colors={colors.gradients.emeraldGlow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cta}
            >
              <Text style={styles.ctaText}>{ctaLabel}</Text>
              <Ionicons
                name={isLast ? "sparkles" : "arrow-forward"}
                size={18}
                color={palette.white}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.ink,
  },
  imageContainer: {
    width: "100%",
    height: height * 0.6,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  topScrim: {
    width: "100%",
    height: 120,
  },
  bottomScrim: {
    width: "100%",
    height: 200,
  },
  skipButton: {
    position: "absolute",
    top: space["3xl"],
    right: space.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  skipText: {
    ...typography.label,
    color: palette.white,
    letterSpacing: 0.3,
  },
  sheet: {
    flex: 1,
    backgroundColor: palette.ink,
    paddingHorizontal: space["2xl"],
    paddingTop: space.xl,
    paddingBottom: space["3xl"],
    justifyContent: "space-between",
  },
  eyebrow: {
    ...typography.label,
    color: palette.gold,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: space.sm,
  },
  title: {
    ...typography.h1,
    color: palette.white,
    letterSpacing: -0.2,
    marginBottom: space.md,
  },
  description: {
    ...typography.bodyLg,
    fontWeight: "400",
    color: palette.slate300,
    lineHeight: 24,
  },
  footer: {
    marginTop: space["2xl"],
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    marginBottom: space.xl,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.slate600,
  },
  dotActive: {
    width: 22,
    backgroundColor: palette.emerald400,
  },
  ctaWrapper: {
    width: "100%",
    borderRadius: radius.pill,
    ...shadows.brand,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    paddingVertical: space.lg,
    borderRadius: radius.pill,
  },
  ctaText: {
    ...typography.h3,
    color: palette.white,
    letterSpacing: 0.4,
  },
});

export default OnboardingSlide;
