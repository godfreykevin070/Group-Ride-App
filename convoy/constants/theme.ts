import type { LinearGradientProps } from "expo-linear-gradient";

export const COLORS = {
  // Base
  black: "#000000",
  bg: "#050608",
  surface: "#0C0E12",
  surface2: "#161A21",
  border: "rgba(255,255,255,0.08)",
  text: "#FFFFFF",
  textDim: "rgba(255,255,255,0.7)",
  muted: "rgba(255,255,255,0.4)",

  // Brand neon
  lime: "#D4FF3A",
  limeDeep: "#A8E600",
  emerald: "#00D68F",
  emeraldDeep: "#004D3D",
  cyan: "#00E5FF",
  purple: "#8B5CF6",
  orange: "#FF6B35",
  yellow: "#FFD60A",
  blue: "#4A6CF7",
  red: "#FF3B30",
  pink: "#FF2D6F",

  // Card colors (Box Box style)
  cardYellow: "#FFD60A",
  cardGreen: "#00D68F",
  cardBlue: "#4A6CF7",
  cardOrange: "#FF6B35",
  cardCream: "#F5EFDC",
};

type G = LinearGradientProps["colors"];

export const GRADIENTS: {
  emerald: G;
  emeraldDeep: G;
  lime: G;
  pink: G;
  cyan: G;
  purple: G;
  orange: G;
  black: G;
  cream: G;
  red: G;
} = {
  emerald: ["#00D68F", "#00A86B", "#003D2A"],
  emeraldDeep: ["#00875A", "#004D3D", "#000000"],
  lime: ["#D4FF3A", "#A8E600"],
  pink: ["#FF2D6F", "#B3004D"],
  cyan: ["#00E5FF", "#0090B3"],
  purple: ["#8B5CF6", "#4C2FB8"],
  orange: ["#FF6B35", "#C43700"],
  black: ["#1A1A1A", "#000000"],
  cream: ["#F5EFDC", "#E8DFC6"],
  red: ["#FF3B30", "#B30000"],
};

export const FONT = {
  // Display weights for the huge numbers
  display: { fontWeight: "900" as const, letterSpacing: -1.5 },
  title: { fontWeight: "900" as const, letterSpacing: -0.5 },
  body: { fontWeight: "600" as const },
  label: {
    fontWeight: "800" as const,
    letterSpacing: 1.2,
    textTransform: "uppercase" as const,
  },
};