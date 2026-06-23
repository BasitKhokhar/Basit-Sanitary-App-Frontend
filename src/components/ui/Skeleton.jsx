// Skeleton — shimmer loading placeholder (Moti). Use to replace blank/spinner
// states for perceived performance.

import React from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { space } from "../../theme/spacing";

export const Skeleton = ({ width = "100%", height = 16, rounded = radius.sm, style }) => (
  <MotiView
    from={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ loop: true, type: "timing", duration: 800 }}
    style={[{ width, height, borderRadius: rounded, backgroundColor: colors.bg.sunken }, style]}
  />
);

// Ready-made product card skeleton matching the ProductCard footprint.
export const ProductCardSkeleton = ({ width }) => (
  <View style={{ width, marginBottom: space.lg }}>
    <Skeleton width={width} height={width} rounded={radius.lg} />
    <Skeleton width="80%" height={14} style={{ marginTop: space.sm }} />
    <Skeleton width="50%" height={14} style={{ marginTop: space.xs }} />
    <Skeleton width="40%" height={18} style={{ marginTop: space.sm }} />
  </View>
);

export default Skeleton;
