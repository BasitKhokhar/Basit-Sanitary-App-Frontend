// Button — primary CTA system with press-scale spring + soft shadow.
// variants: primary (filled emerald gradient) | secondary | ghost | danger
// Fixes weak CTA hierarchy across the app.

import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/MaterialIcons";
import PressableScale from "./PressableScale";
import AppText from "./Text";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const SIZES = {
  sm: { height: 40, padH: space.lg, text: "label" },
  md: { height: 52, padH: space.xl, text: "bodyLg" },
  lg: { height: 58, padH: space["2xl"], text: "bodyLg" },
};

const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = true,
  style,
}) => {
  const cfg = SIZES[size] || SIZES.md;
  const isDisabled = disabled || loading;

  const textColor =
    variant === "primary" || variant === "danger"
      ? "onPrimary"
      : variant === "secondary"
      ? "primary"
      : "brand";

  const renderInner = () => (
    <View style={styles.inner}>
      {loading ? (
        <ActivityIndicator color={textColor === "onPrimary" ? colors.text.onPrimary : colors.brand.primary} />
      ) : (
        <>
          {icon ? (
            <Icon name={icon} size={20} color={colorFor(textColor)} style={{ marginRight: space.sm }} />
          ) : null}
          <AppText variant={cfg.text} color={textColor} weight="700">
            {title}
          </AppText>
          {iconRight ? (
            <Icon name={iconRight} size={20} color={colorFor(textColor)} style={{ marginLeft: space.sm }} />
          ) : null}
        </>
      )}
    </View>
  );

  const containerStyle = [
    { height: cfg.height, paddingHorizontal: cfg.padH, borderRadius: radius.lg },
    fullWidth && { alignSelf: "stretch" },
    isDisabled && { opacity: 0.5 },
    style,
  ];

  if (variant === "primary") {
    return (
      <PressableScale onPress={isDisabled ? undefined : onPress} disabled={isDisabled} accessibilityLabel={title} style={[shadows.brand, fullWidth && { alignSelf: "stretch" }]}>
        <LinearGradient
          colors={colors.gradients.emeraldGlow}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, containerStyle]}
        >
          {renderInner()}
        </LinearGradient>
      </PressableScale>
    );
  }

  if (variant === "danger") {
    return (
      <PressableScale onPress={isDisabled ? undefined : onPress} disabled={isDisabled} accessibilityLabel={title}>
        <View style={[styles.base, containerStyle, { backgroundColor: colors.status.error }, shadows.e2]}>
          {renderInner()}
        </View>
      </PressableScale>
    );
  }

  // secondary (tinted) / ghost (outline)
  const surface =
    variant === "secondary"
      ? { backgroundColor: colors.brand.tint }
      : { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.brand.primary };

  return (
    <PressableScale onPress={isDisabled ? undefined : onPress} disabled={isDisabled} accessibilityLabel={title}>
      <View style={[styles.base, containerStyle, surface]}>{renderInner()}</View>
    </PressableScale>
  );
};

const colorFor = (role) =>
  role === "onPrimary" ? colors.text.onPrimary : role === "primary" ? colors.text.primary : colors.brand.primary;

const styles = StyleSheet.create({
  base: { justifyContent: "center", alignItems: "center" },
  inner: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
});

export default React.memo(Button);
