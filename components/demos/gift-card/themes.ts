// Ported from Swyftng (src/components/gift-card/themes.ts), trimmed to what the demo uses.
// A gift card design is four hex values. The names are a frontend convenience only:
// the backend stores the four hexes, so a name can change without touching the API.

export type GiftCardTheme = { bgEdge: string; bgMid: string; script: string; boxMain: string };

export type NamedGiftCardTheme = { name: string; theme: GiftCardTheme };

// The four named colours the backend stores. The mapping to the visual is fixed:
// primary -> bgEdge, secondary -> bgMid, accent -> boxMain, text -> script.
export type GiftCardColors = { primary: string; secondary: string; accent: string; text: string };

export const GIFT_CARD_THEMES: NamedGiftCardTheme[] = [
  { name: "SUPA", theme: { bgEdge: "#EDDEE3", bgMid: "#F6EFF1", script: "#850E35", boxMain: "#850E35" } },
  { name: "BETA", theme: { bgEdge: "#FFECD7", bgMid: "#FFF8F0", script: "#7556F1", boxMain: "#7556F1" } },
  { name: "SMALLIE", theme: { bgEdge: "#DFD8FD", bgMid: "#F1EEFE", script: "#FD9C29", boxMain: "#7556F1" } },
  { name: "MEGA", theme: { bgEdge: "#D8E7FD", bgMid: "#EEF4FE", script: "#1D4ED8", boxMain: "#1D4ED8" } },
  { name: "PRIME", theme: { bgEdge: "#FBD9E4", bgMid: "#FDEEF3", script: "#BE123C", boxMain: "#BE123C" } },
  { name: "ROYAL", theme: { bgEdge: "#E0D7FA", bgMid: "#F1ECFD", script: "#6D28D9", boxMain: "#6D28D9" } },
  { name: "EMERALD", theme: { bgEdge: "#CFEFDD", bgMid: "#E9F8F0", script: "#047857", boxMain: "#047857" } },
  { name: "CORAL", theme: { bgEdge: "#FEDFD3", bgMid: "#FFF0EA", script: "#EA580C", boxMain: "#EA580C" } },
  { name: "OCEAN", theme: { bgEdge: "#CFEBF3", bgMid: "#E9F7FB", script: "#0E7490", boxMain: "#0E7490" } },
  { name: "SLATE", theme: { bgEdge: "#DBE0E7", bgMid: "#EEF1F4", script: "#334155", boxMain: "#334155" } },
  { name: "GOLDEN", theme: { bgEdge: "#FBEBC6", bgMid: "#FDF6E4", script: "#B45309", boxMain: "#B45309" } },
  { name: "BERRY", theme: { bgEdge: "#F6D6EE", bgMid: "#FCECF8", script: "#A21CAF", boxMain: "#A21CAF" } },
  { name: "FOREST", theme: { bgEdge: "#D5E7CF", bgMid: "#EDF5E9", script: "#3F6212", boxMain: "#3F6212" } },
  { name: "CRIMSON", theme: { bgEdge: "#F9D3D3", bgMid: "#FCEBEB", script: "#B91C1C", boxMain: "#B91C1C" } },
  { name: "INDIGO", theme: { bgEdge: "#D7DAFB", bgMid: "#ECEDFD", script: "#4338CA", boxMain: "#4338CA" } },
  { name: "SUNSET", theme: { bgEdge: "#FDDDCB", bgMid: "#FEF0E7", script: "#C2410C", boxMain: "#C2410C" } },
  { name: "MINT", theme: { bgEdge: "#CDEEE4", bgMid: "#E8F8F2", script: "#0F766E", boxMain: "#0F766E" } },
  { name: "PLUM", theme: { bgEdge: "#E7D5F0", bgMid: "#F4EBF9", script: "#7E22CE", boxMain: "#7E22CE" } },
  { name: "AMBER", theme: { bgEdge: "#FBE7BF", bgMid: "#FDF4DF", script: "#D97706", boxMain: "#D97706" } },
  { name: "TEAL", theme: { bgEdge: "#CCEDEA", bgMid: "#E7F7F5", script: "#0D9488", boxMain: "#0D9488" } },
  { name: "RUBY", theme: { bgEdge: "#FAD2DC", bgMid: "#FDEAF0", script: "#9F1239", boxMain: "#9F1239" } },
  { name: "COBALT", theme: { bgEdge: "#D2E0FB", bgMid: "#EAF0FD", script: "#1E40AF", boxMain: "#1E40AF" } },
  { name: "OLIVE", theme: { bgEdge: "#E4E8C9", bgMid: "#F3F5E6", script: "#4D7C0F", boxMain: "#4D7C0F" } },
  { name: "ROSE", theme: { bgEdge: "#FBD5E1", bgMid: "#FDECF1", script: "#E11D48", boxMain: "#E11D48" } },
  { name: "VIOLET", theme: { bgEdge: "#E4D8FA", bgMid: "#F2ECFD", script: "#7C3AED", boxMain: "#7C3AED" } },
  { name: "SAND", theme: { bgEdge: "#F0E3CE", bgMid: "#F9F2E6", script: "#92400E", boxMain: "#92400E" } },
  { name: "AZURE", theme: { bgEdge: "#CFE8FB", bgMid: "#E8F4FD", script: "#0369A1", boxMain: "#0369A1" } },
  { name: "FUCHSIA", theme: { bgEdge: "#F9D4F0", bgMid: "#FCEBF9", script: "#C026D3", boxMain: "#C026D3" } },
  { name: "PINE", theme: { bgEdge: "#CDEBDD", bgMid: "#E8F7EF", script: "#166534", boxMain: "#166534" } },
  { name: "CLARET", theme: { bgEdge: "#EFD6DC", bgMid: "#F8ECEF", script: "#881337", boxMain: "#881337" } },
];

export function themeToColors(t: GiftCardTheme): GiftCardColors {
  return { primary: t.bgEdge, secondary: t.bgMid, accent: t.boxMain, text: t.script };
}

// Canonical, case-insensitive key for a colour set, so stored colours can be matched to a theme.
export function colorKey(c: GiftCardColors): string {
  return [c.primary, c.secondary, c.accent, c.text].map((h) => h.toLowerCase()).join("|");
}

const COLOR_KEY_TO_NAME: Record<string, string> = Object.fromEntries(
  GIFT_CARD_THEMES.map(({ name, theme }) => [colorKey(themeToColors(theme)), name]),
);

// Reverse lookup used when editing a card: which theme do these stored colours belong to?
export function nameFromColors(c: GiftCardColors): string | undefined {
  return COLOR_KEY_TO_NAME[colorKey(c)];
}
