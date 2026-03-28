export interface Skill {
  id: string;
  lvl: number;
  max: boolean;
}

export interface Player {
  position: string;
  name: string;
  specialSkillCount: number;
  specialSkills: string[];
  strengths: string[];
  weakness: string;
  skills: Skill[];
  isGoalie: boolean;
}

export interface Category {
  id: string;
  label: string;
  skillIds: string[];
  isGoalie?: boolean;
  topN?: number;
  weights?: number[];
}

export interface RankedPlayer extends Player {
  subOvr: number;
  rank: number;
  groupIndex: number;
  isDummy: boolean;
  isBench: boolean;
}
