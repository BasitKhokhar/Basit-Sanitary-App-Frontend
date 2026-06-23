// RatingStars — display or interactive star rating.

import React from "react";
import { View, Pressable } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import AppText from "./Text";
import { colors } from "../../theme/colors";
import { space } from "../../theme/spacing";

const RatingStars = ({
  rating = 0,
  count,
  size = 14,
  editable = false,
  onChange,
  showValue = false,
  style,
}) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      {stars.map((s) => {
        const name = rating >= s ? "star" : rating >= s - 0.5 ? "star-half" : "star-border";
        const StarIcon = (
          <Icon name={name} size={size} color={colors.accent.base} />
        );
        return editable ? (
          <Pressable key={s} onPress={() => onChange?.(s)} hitSlop={6} accessibilityRole="button" accessibilityLabel={`${s} star`}>
            {StarIcon}
          </Pressable>
        ) : (
          <View key={s}>{StarIcon}</View>
        );
      })}
      {showValue ? (
        <AppText variant="caption" color="secondary" weight="600" style={{ marginLeft: space.xs }}>
          {Number(rating).toFixed(1)}
        </AppText>
      ) : null}
      {count != null ? (
        <AppText variant="caption" color="muted" style={{ marginLeft: space.xs }}>
          ({count})
        </AppText>
      ) : null}
    </View>
  );
};

export default React.memo(RatingStars);
