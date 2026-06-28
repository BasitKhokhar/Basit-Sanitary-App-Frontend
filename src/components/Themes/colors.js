// ============================================================================
// BACK-COMPAT SHIM
// The real design system now lives in src/theme/. This file maps the OLD
// flat `colors` keys onto the new deep-emerald palette so every existing
// `import { colors } from ".../Themes/colors"` keeps working unchanged.
//
// NEW code should import from "src/theme" instead:
//   import { theme, colors as tokens } from "../../theme";
// ============================================================================

import { colors as t } from "../../theme/colors";

export const colors = {
  // --- legacy flat keys (mapped to new semantic tokens) ---
  bodybackground: t.bg.canvas,
  cardsbackground: t.bg.surface,
  primary: t.brand.primary,
  accent: t.brand.primaryDark,
  secondary: t.border.default,
  text: t.text.primary,
  mutedText: t.text.muted,
  border: t.border.default,
  error: t.status.error,
  headerbg: t.bg.inverse,
  formbg: t.palette.ink,
  white: t.text.onPrimary,

  // legacy gradient names → new emerald gradients
  gradients: {
    ocean: t.gradients.emeraldDeep,
    mintGlow: t.gradients.emeraldGlow,
    aquaPulse: t.gradients.emeraldGlow,
    deepTech: t.gradients.canvas,
    dark: t.gradients.dark,
  },

  // expose the full new token tree too, for gradual migration
  tokens: t,
};

export default colors;
