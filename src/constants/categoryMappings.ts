export const CATEGORY_MAPPINGS = {
  C: "Casino",
  SL: "Slots",
  F: "Fishing",
  G: "3D Games",
  FG: "Fast Games",

  S: "Sports",
  ES: "E-Sports",
  L: "Lottery",
  P: "Poker",
  RC: "Racing",
  CF: "Cockfight",
} as const;

export const getCategoryLabel = (key: string): string => {
  return CATEGORY_MAPPINGS[key as keyof typeof CATEGORY_MAPPINGS] || key;
};
