// CategoryCard — minimal icon/image + label tile.

import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import PressableScale from "../ui/PressableScale";
import AppText from "../ui/Text";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";

const CategoryCard = ({ label, image, icon = "category", onPress, size = 72, style }) => (
  <PressableScale onPress={onPress} style={[styles.wrap, style]} accessibilityLabel={label}>
    <View style={[styles.tile, { width: size, height: size }]}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      ) : (
        <Icon name={icon} size={28} color={colors.brand.primary} />
      )}
    </View>
    <AppText variant="caption" color="secondary" weight="600" numberOfLines={1} align="center" style={styles.label}>
      {label}
    </AppText>
  </PressableScale>
);

const styles = StyleSheet.create({
  wrap: { alignItems: "center", width: 80 },
  tile: {
    borderRadius: radius.lg,
    backgroundColor: colors.brand.tint,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    ...shadows.e1,
  },
  image: { width: "100%", height: "100%" },
  label: { marginTop: space.xs, width: 76 },
});

export default React.memo(CategoryCard);
