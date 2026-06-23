// ============================================================================
// MOTION — animation timing tokens. Premium = subtle + smooth, never flashy.
// ============================================================================

import { Easing } from "react-native-reanimated";

export const duration = {
  fast: 150,
  base: 250,
  slow: 400,
};

// Reanimated spring presets
export const spring = {
  gentle: { damping: 18, stiffness: 180, mass: 1 },
  bouncy: { damping: 12, stiffness: 220, mass: 1 },
  stiff: { damping: 26, stiffness: 320, mass: 1 },
};

export const easing = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  decelerate: Easing.out(Easing.cubic),
  accelerate: Easing.in(Easing.cubic),
};

// Press feedback scale used across tappable surfaces
export const pressScale = 0.97;

export const motion = { duration, spring, easing, pressScale };

export default motion;
