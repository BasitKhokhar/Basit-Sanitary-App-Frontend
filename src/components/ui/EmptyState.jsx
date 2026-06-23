// EmptyState — friendly empty/error placeholder with optional CTA.

import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import AppText from "./Text";
import Button from "./Button";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";

const EmptyState = ({ icon = "inbox", title, subtitle, actionLabel, onAction, style }) => (
  <View style={[styles.wrap, style]}>
    <View style={styles.iconCircle}>
      <Icon name={icon} size={36} color={colors.brand.primary} />
    </View>
    {title ? (
      <AppText variant="h3" align="center" style={{ marginTop: space.lg }}>
        {title}
      </AppText>
    ) : null}
    {subtitle ? (
      <AppText variant="body" color="muted" align="center" style={{ marginTop: space.xs, maxWidth: 280 }}>
        {subtitle}
      </AppText>
    ) : null}
    {actionLabel && onAction ? (
      <Button title={actionLabel} onPress={onAction} fullWidth={false} size="md" style={{ marginTop: space.xl, paddingHorizontal: space["3xl"] }} />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: space["3xl"] },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: colors.brand.tint,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EmptyState;
