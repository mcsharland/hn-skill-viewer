import type { Category } from "./types";

// display order
export const SKATER_SKILLS = [
  { id: "SKA", label: "SKA", fullName: "Skating" },
  { id: "END", label: "END", fullName: "Endurance" },
  { id: "PWR", label: "PWR", fullName: "Power" },
  { id: "SHO", label: "SHO", fullName: "Shooting" },
  { id: "PAS", label: "PAS", fullName: "Passing" },
  { id: "DEF", label: "DEF", fullName: "Defending" },
  { id: "CHK", label: "CHK", fullName: "Checking" },
  { id: "DSC", label: "DSC", fullName: "Discipline" },
  { id: "FOF", label: "FOF", fullName: "Faceoffs" },
] as const;

// display order
export const GOALIE_SKILLS = [
  { id: "REF", label: "REF", fullName: "Reflexes" },
  { id: "END", label: "END", fullName: "Endurance" },
  { id: "POS", label: "POS", fullName: "Positioning" },
  { id: "PAD", label: "PAD", fullName: "Pads" },
  { id: "GLO", label: "GLO", fullName: "Glove" },
  { id: "BLO", label: "BLO", fullName: "Blocker" },
  { id: "STK", label: "STK", fullName: "Stick" },
] as const;

// group weights
export const GROUP_WEIGHTS = [0.29, 0.24, 0.18, 0.14, 0.1, 0.05] as const;

// goalie weights
export const GOALIE_WEIGHTS = [0.8, 0.2] as const;

export const SKATER_TOP_N = 18;

export const GROUP_SIZE = 3;

export const GOALIE_TOP_N = 2;

export const GOALIE_GROUP_SIZE = 1;

// skill categories
export const CATEGORIES: Category[] = [
  { id: "offense", label: "OFF", skillIds: ["SHO", "PAS"] },
  { id: "defense", label: "DEF", skillIds: ["CHK", "DEF"] },
  { id: "physical", label: "PHY", skillIds: ["PWR", "END", "SKA"] },
  {
    id: "goaltending",
    label: "GOA",
    skillIds: ["REF", "END", "POS", "PAD", "GLO", "BLO", "STK"],
    isGoalie: true,
    topN: 2,
    weights: [0.8, 0.2],
  },
];

export const GROUP_HUES = [210, 280, 340, 160, 30, 50] as const;

const TAB_COLORS = [
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#22d3ee",
  "#10b981",
  "#f43f5e",
];

export function getTabColor(index: number): string {
  return TAB_COLORS[index % TAB_COLORS.length];
}
