// QuantityStepper — compact +/- control for cart quantities.

import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import AppText from "./Text";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";

const QuantityStepper = ({ value = 1, onChange, min = 1, max = 99, size = "md" }) => {
  const dim = size === "sm" ? 28 : 34;
  const dec = () => value > min && onChange?.(value - 1);
  const inc = () => value < max && onChange?.(value + 1);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={dec}
        disabled={value <= min}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        style={[styles.btn, { width: dim, height: dim }, value <= min && styles.disabled]}
      >
        <Icon name="remove" size={18} color={colors.text.primary} />
      </Pressable>
      <AppText variant="bodyLg" weight="700" style={styles.value}>
        {value}
      </AppText>
      <Pressable
        onPress={inc}
        disabled={value >= max}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        style={[styles.btn, { width: dim, height: dim }, value >= max && styles.disabled]}
      >
        <Icon name="add" size={18} color={colors.text.primary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg.sunken,
    borderRadius: radius.pill,
    padding: 3,
  },
  btn: {
    borderRadius: radius.pill,
    backgroundColor: colors.bg.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: { opacity: 0.4 },
  value: { minWidth: 32, textAlign: "center", paddingHorizontal: space.xs },
});

export default React.memo(QuantityStepper);
