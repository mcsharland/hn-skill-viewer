import type { Player, RankedPlayer, Skill, Category } from "./types";
import {
  GROUP_WEIGHTS,
  GROUP_SIZE,
  SKATER_TOP_N,
  GOALIE_GROUP_SIZE,
} from "./constants";

/**
 * Calculate a player's sub-OVR for a given set of target skills.
 * Mirrors the HN rating formula from the solver:
 *   1. Filter to relevant skills
 *   2. Sum + compute average
 *   3. Add excess above average (bonus for spikes)
 *   4. Corrected average × 10, rounded
 */
export function calculatePlayerSubOvr(
  playerSkills: Skill[],
  targetSkillIds: string[],
): number {
  const relevant = playerSkills.filter((s) => targetSkillIds.includes(s.id));
  if (relevant.length === 0) return 25;

  const sum = relevant.reduce((acc, s) => acc + s.lvl, 0);
  const avg = sum / relevant.length;

  const excess = relevant.reduce(
    (acc, s) => (s.lvl > avg ? acc + (s.lvl - avg) : acc),
    0,
  );

  const correctedAvg = (sum + excess) / relevant.length;
  return Math.round(correctedAvg * 10);
}

/** Create a dummy player to pad empty roster slots. */
function createDummy(rank: number, isGoalie: boolean): RankedPlayer {
  return {
    position: isGoalie ? "G" : "–",
    name: "Dummy",
    specialSkillCount: 0,
    specialSkills: [],
    strengths: [],
    weakness: "",
    skills: [],
    isGoalie,
    subOvr: 25,
    rank,
    groupIndex: -1, // assigned later
    isDummy: true,
    isBench: false,
  };
}

/**
 * Rank players by sub-OVR for a given category.
 * Returns ALL players: top N (with dummies if needed) + bench.
 */
export function rankPlayers(
  players: Player[],
  category: Category,
): RankedPlayer[] {
  const isGoalie = category.isGoalie ?? false;
  const topN = category.topN ?? SKATER_TOP_N;
  const groupSize = isGoalie ? GOALIE_GROUP_SIZE : GROUP_SIZE;

  // Filter to correct player type
  const pool = players.filter((p) => (isGoalie ? p.isGoalie : !p.isGoalie));

  // Score and sort
  const scored = pool.map((p) => ({
    ...p,
    subOvr: calculatePlayerSubOvr(p.skills, category.skillIds),
  }));
  scored.sort((a, b) => b.subOvr - a.subOvr);

  const result: RankedPlayer[] = [];

  // Top N slots (pad with dummies)
  for (let i = 0; i < topN; i++) {
    if (i < scored.length) {
      result.push({
        ...scored[i],
        rank: i + 1,
        groupIndex: Math.floor(i / groupSize),
        isDummy: false,
        isBench: false,
      });
    } else {
      const dummy = createDummy(i + 1, isGoalie);
      dummy.groupIndex = Math.floor(i / groupSize);
      result.push(dummy);
    }
  }

  // Bench (everyone beyond top N)
  const benchGroupIndex = Math.floor(topN / groupSize); // one past last ranked group
  for (let i = topN; i < scored.length; i++) {
    result.push({
      ...scored[i],
      rank: i + 1,
      groupIndex: benchGroupIndex,
      isDummy: false,
      isBench: true,
    });
  }

  return result;
}

 // calculate final weighted team rating for a category
export function calculateTeamRating(
  rankedPlayers: RankedPlayer[],
  category: Category,
): number {
  const isGoalie = category.isGoalie ?? false;
  // const topN = category.topN ?? SKATER_TOP_N;
  const weights = category.weights ?? [...GROUP_WEIGHTS];
  const groupSize = isGoalie ? GOALIE_GROUP_SIZE : GROUP_SIZE;

  const scores = rankedPlayers
    .filter((p) => !p.isBench)
    .map((p) => p.subOvr);

  const groupCount = weights.length;
  let total = 0;

  for (let i = 0; i < groupCount; i++) {
    const start = i * groupSize;
    let groupSum = 0;
    for (let j = 0; j < groupSize; j++) {
      groupSum += scores[start + j] ?? 25;
    }
    total += (groupSum / groupSize) * weights[i];
  }

  return Math.round(total);
}
