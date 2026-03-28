import type { Player, Skill } from "./types";

 // columns index -> skill ID for skaters
 // matches XLS export column layout
const SKATER_SKILL_COLUMNS: Record<number, string> = {
  6: "SKA", 7: "END", 8: "PWR", 9: "SHO",
  10: "PAS", 11: "DEF", 12: "CHK", 13: "DSC", 14: "FOF",
};

 // column index -> skill ID for goalies
 // // goalies share END column at 7 but have unique columns 15-20
const GOALIE_SKILL_COLUMNS: Record<number, string> = {
  7: "END", 15: "REF", 16: "POS",
  17: "PAD", 18: "GLO", 19: "BLO", 20: "STK",
};

// cell with a font color indicate skill is maxed
function isMaxed(td: Element): boolean {
  return td.querySelector("font[color]") !== null;
}

// extract skill level and max flag from a <td>
function parseSkillCell(td: Element): { lvl: number; max: boolean } | null {
  const text = td.textContent?.trim() ?? "";
  if (text === "") return null;
  const lvl = parseInt(text, 10);
  if (isNaN(lvl)) return null;
  return { lvl, max: isMaxed(td) };
}

function splitCsv(text: string): string[] {
  return text.split(",").map((s) => s.trim()).filter(Boolean);
}

export function parseRosterHtml(html: string): Player[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const rows = doc.querySelectorAll("tbody tr");

  if (rows.length === 0) {
    throw new Error("No player rows found. Is this a valid Hockey Nation skill export?");
  }

  const players: Player[] = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 6) return;

    const position = cells[0].textContent?.trim() ?? "";
    const name = cells[1].textContent?.trim() ?? "";
    const isGoalie = position === "G";
    const skillMap = isGoalie ? GOALIE_SKILL_COLUMNS : SKATER_SKILL_COLUMNS;

    const skills: Skill[] = [];
    for (const [colIdx, skillId] of Object.entries(skillMap)) {
      const cell = cells[parseInt(colIdx, 10)];
      if (!cell) continue;
      const parsed = parseSkillCell(cell);
      if (parsed) {
        skills.push({ id: skillId, ...parsed });
      }
    }

    players.push({
      position,
      name,
      specialSkillCount: parseInt(cells[2].textContent?.trim() ?? "0", 10),
      specialSkills: splitCsv(cells[3].textContent?.trim() ?? ""),
      strengths: splitCsv(cells[4].textContent?.trim() ?? ""),
      weakness: cells[5].textContent?.trim() ?? "",
      skills,
      isGoalie,
    });
  });

  return players;
}
