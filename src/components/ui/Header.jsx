// Header — minimal sticky screen header (back + title + optional right action).
// For nested stack screens. The main tab header lives in App.js MainLayout.

import React from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import PressableScale from "./PressableScale";
import AppText from "./Text";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";

const Header = ({ title, onBack, rightIcon, onRightPress, subtitle, style }) => (
  <View style={[styles.wrap, style]}>
    {onBack ? (
      <PressableScale onPress={onBack} style={styles.circle} accessibilityLabel="Go back">
        <Icon name="arrow-back" size={22} color={colors.text.primary} />
      </PressableScale>
    ) : (
      <View style={styles.circle} />
    )}

    <View style={styles.titleWrap}>
      <AppText variant="h3" numberOfLines={1} align="center">
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="caption" color="muted" align="center" numberOfLines={1}>
          {subtitle}
        </AppText>
      ) : null}
    </View>

    {rightIcon ? (
      <PressableScale onPress={onRightPress} style={styles.circle} accessibilityLabel="Action">
        <Icon name={rightIcon} size={22} color={colors.text.primary} />
      </PressableScale>
    ) : (
      <View style={styles.circle} />
    )}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
    paddingTop: (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + space.md,
    backgroundColor: colors.bg.canvas,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.bg.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  titleWrap: { flex: 1, alignItems: "center", paddingHorizontal: space.sm },
});

export default React.memo(Header);
