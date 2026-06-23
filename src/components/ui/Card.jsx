// Card — surface container with token radius + soft premium shadow.

import React from "react";
import { View } from "react-native";
import PressableScale from "./PressableScale";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { space } from "../../theme/spacing";
import { shadows } from "../../theme/shadows";

const Card = ({
  children,
  onPress,
  elevation = "e2",
  padded = true,
  radiusSize = "lg",
  style,
  accessibilityLabel,
}) => {
  const base = [
    {
      backgroundColor: colors.bg.surface,
      borderRadius: radius[radiusSize] ?? radius.lg,
      padding: padded ? space.lg : 0,
    },
    shadows[elevation] || shadows.e2,
    style,
  ];

  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={base} accessibilityLabel={accessibilityLabel}>
        {children}
      </PressableScale>
    );
  }
  return <View style={base}>{children}</View>;
};

export default React.memo(Card);
