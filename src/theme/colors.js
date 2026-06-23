// ============================================================================
// COLORS — Single source of truth (deep premium emerald system)
// Edit values here and the entire app updates on reload.
// Use SEMANTIC roles in code (e.g. colors.bg.canvas), not raw hex.
// ============================================================================

const palette = {
  // Emerald brand ramp
  emerald900: "#07351F",
  emerald800: "#07724A",
  emerald700: "#0A8F5B",
  emerald500: "#1FA66E",
  emerald400: "#3FB683",
  emerald200: "#9BD9BF",
  emerald100: "#E6F4EE",

  // Neutrals (cool green-tinted greys)
  ink: "#0C1A14",
  ink2: "#16261E",
  slate900: "#14201B",
  slate700: "#2C3A33",
  slate600: "#4A5A53",
  slate500: "#6C7B74",
  slate300: "#B9C5C0",
  slate200: "#D3DCD8",
  slate100: "#E4EAE7",
  mist: "#EEF2F0",
  canvas: "#F8FAF9",
  white: "#FFFFFF",

  // Warm accent (premium trust / offers — used sparingly)
  gold: "#C9A24B",
  goldSoft: "#F2E7CC",

  // Status
  green: "#0A8F5B",
  amber: "#C9821B",
  red: "#E0413A",
  blue: "#1E73BE",
};

export const colors = {
  // Backgrounds / surfaces
  bg: {
    canvas: palette.canvas,
    surface: palette.white,
    sunken: palette.mist,
    inverse: palette.ink,
    tint: palette.emerald100,
  },

  // Brand
  brand: {
    primary: palette.emerald700,
    primaryDark: palette.emerald800,
    primaryLight: palette.emerald400,
    tint: palette.emerald100,
  },

  // Text hierarchy
  text: {
    primary: palette.slate900,
    secondary: palette.slate600,
    muted: palette.slate500,
    inverse: palette.canvas,
    onPrimary: palette.white,
    link: palette.emerald700,
  },

  // Borders / dividers
  border: {
    subtle: palette.slate100,
    default: palette.slate200,
    strong: palette.slate300,
  },

  // Status
  status: {
    success: palette.green,
    warning: palette.amber,
    error: palette.red,
    info: palette.blue,
  },

  // Warm accent
  accent: {
    base: palette.gold,
    soft: palette.goldSoft,
  },

  // Gradients (tuples for expo-linear-gradient)
  gradients: {
    emeraldDeep: [palette.emerald700, palette.emerald800],
    emeraldGlow: [palette.emerald400, palette.emerald700],
    dark: [palette.ink, palette.ink2],
    canvas: [palette.canvas, "#EAF0ED"],
    gold: [palette.gold, "#A87E2E"],
  },

  // Raw ramp (escape hatch — avoid in screens)
  palette,
};

export default colors;
