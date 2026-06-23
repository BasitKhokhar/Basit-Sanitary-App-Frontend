// ============================================================================
// THEME — single import surface for the whole design system.
//   import { theme } from "../../src/theme";
//   theme.colors.brand.primary, theme.space.lg, theme.type.h1, theme.shadow.e2 ...
// Individual tokens are also exported for convenience.
// ============================================================================

import { colors } from "./colors";
import { typography, fontWeight, FONT_FAMILY } from "./typography";
import { space } from "./spacing";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { motion } from "./motion";

export const theme = {
  colors,
  type: typography,
  fontWeight,
  fontFamily: FONT_FAMILY,
  space,
  radius,
  shadow: shadows,
  motion,
};

export { colors, typography, fontWeight, FONT_FAMILY, space, radius, shadows, motion };
export default theme;
