// ============================================================================
// TYPOGRAPHY — modern sans-serif scale (SF Pro / Inter feel).
// `fontFamily` is left undefined to use the system font by default.
// To enable Inter: load it via expo-font and set FONT_FAMILY below.
// ============================================================================

import { Platform } from "react-native";

// System default gives SF Pro on iOS and Roboto on Android (premium + free).
export const FONT_FAMILY = Platform.select({ ios: undefined, android: undefined });

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  heavy: "800",
};

// Each variant: fontSize / lineHeight / fontWeight / letterSpacing
export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: fontWeight.bold, letterSpacing: -0.5 },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: fontWeight.bold, letterSpacing: -0.4 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: fontWeight.bold, letterSpacing: -0.3 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: fontWeight.semibold, letterSpacing: -0.2 },
  bodyLg: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.medium, letterSpacing: 0 },
  body: { fontSize: 14, lineHeight: 21, fontWeight: fontWeight.regular, letterSpacing: 0 },
  label: { fontSize: 13, lineHeight: 18, fontWeight: fontWeight.semibold, letterSpacing: 0.1 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular, letterSpacing: 0.1 },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: fontWeight.medium, letterSpacing: 0.2 },
};

export default typography;
