// ============================================================================
// SHADOWS — soft premium depth. Spread into a style object.
// Cross-platform: iOS shadow props + Android elevation.
// ============================================================================

import { colors } from "./colors";

const shadowColor = colors.palette.ink;

export const shadows = {
  none: {},
  e1: {
    shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  e2: {
    shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  e3: {
    shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  e4: {
    shadowColor,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 12,
  },
  // Brand-tinted glow for primary CTAs
  brand: {
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
};

export default shadows;
