// Badge / Chip — ratings, offers, trust indicators, filter chips.

import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import AppText from "./Text";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";

const TONES = {
  brand: { bg: colors.brand.tint, fg: colors.brand.primaryDark },
  success: { bg: "#E3F3EB", fg: colors.status.success },
  warning: { bg: "#FBF0DD", fg: colors.status.warning },
  error: { bg: "#FBE4E3", fg: colors.status.error },
  gold: { bg: colors.accent.soft, fg: "#8A6A1E" },
  neutral: { bg: colors.bg.sunken, fg: colors.text.secondary },
  solid: { bg: colors.brand.primary, fg: colors.text.onPrimary },
};

const Badge = ({ label, tone = "brand", icon, size = "md", style }) => {
  const t = TONES[tone] || TONES.brand;
  const small = size === "sm";
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: t.bg,
          paddingHorizontal: small ? space.sm : space.md,
          paddingVertical: small ? 2 : space.xs,
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={small ? 11 : 13} color={t.fg} style={{ marginRight: 3 }} /> : null}
      <AppText variant={small ? "micro" : "caption"} weight="700" style={{ color: t.fg }}>
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radius.pill,
  },
});

export default React.memo(Badge);
