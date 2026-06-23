// Text — typographic component. Replaces inline fontSize everywhere.
//   <AppText variant="h2" color="primary">Title</AppText>
//   <AppText variant="caption" color="muted">subtitle</AppText>

import React from "react";
import { Text as RNText } from "react-native";
import { typography, FONT_FAMILY } from "../../theme/typography";
import { colors } from "../../theme/colors";

const colorRole = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  muted: colors.text.muted,
  inverse: colors.text.inverse,
  onPrimary: colors.text.onPrimary,
  brand: colors.brand.primary,
  link: colors.text.link,
  error: colors.status.error,
  success: colors.status.success,
  accent: colors.accent.base,
};

const AppText = ({
  variant = "body",
  color = "primary",
  align,
  weight,
  numberOfLines,
  style,
  children,
  ...rest
}) => {
  const base = typography[variant] || typography.body;
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[
        base,
        FONT_FAMILY ? { fontFamily: FONT_FAMILY } : null,
        { color: colorRole[color] || color },
        align ? { textAlign: align } : null,
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default React.memo(AppText);
