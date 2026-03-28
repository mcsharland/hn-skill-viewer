import type { RankedPlayer, Category } from "../types";
import {
  SKATER_SKILLS,
  GOALIE_SKILLS,
  GROUP_HUES,
  GROUP_WEIGHTS,
  // GROUP_SIZE,
  // GOALIE_GROUP_SIZE,
} from "../constants";
import { useFlip } from "react-easy-flip";

interface BubbleTableProps {
  players: RankedPlayer[];
  category: Category;
  accentColor: string;
}

const FLIP_ROOT_ID = "bt-flip-root";

// ids for flip animation
function toFlipId(player: RankedPlayer): string {
  if (player.isDummy) return `dummy-${player.rank}`;
  return player.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

function getGroupColor(groupIndex: number): string {
  const hue = GROUP_HUES[groupIndex % GROUP_HUES.length];
  return `hsl(${hue}, 70%, 55%)`;
}

function groupBy(players: RankedPlayer[]): RankedPlayer[][] {
  const map = new Map<number, RankedPlayer[]>();
  for (const p of players) {
    const arr = map.get(p.groupIndex) ?? [];
    arr.push(p);
    map.set(p.groupIndex, arr);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, v]) => v);
}

function SkillHeaders({
  skills,
  selectedSkillIds,
  accentColor,
  gridCols,
}: {
  skills: readonly { id: string; label: string }[];
  selectedSkillIds: string[];
  accentColor: string;
  gridCols: string;
}) {
  return (
    <div className="bt-header" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 8 }}>
      <span />
      <span className="bt-header__label bt-header__label--inactive">Player</span>
      {skills.map((s) => {
        const active = selectedSkillIds.includes(s.id);
        return (
          <div key={s.id} className="bt-header__skill">
            <span
              className={`bt-header__label ${active ? "" : "bt-header__label--inactive"}`}
              style={active ? { color: accentColor } : undefined}
            >
              {s.label}
            </span>
            <div
              className={`bt-header__glow ${active ? "" : "bt-header__glow--inactive"}`}
              style={active ? { background: accentColor, boxShadow: `0 0 8px ${accentColor}88` } : undefined}
            />
          </div>
        );
      })}
      <span className="bt-header__label bt-header__label--inactive bt-header__ovr">P-OVR</span>
    </div>
  );
}

function PlayerRow({
  player,
  skills,
  selectedSkillIds,
  accentColor,
  gridCols,
  groupColor,
}: {
  player: RankedPlayer;
  skills: readonly { id: string; label: string }[];
  selectedSkillIds: string[];
  accentColor: string;
  gridCols: string;
  groupColor: string;
}) {
  return (
    <div
      className="bt-row"
      style={{
        display: "grid",
        gridTemplateColumns: gridCols,
        gap: 8,
        borderLeft: `4px solid ${groupColor}`,
        opacity: player.isDummy ? 0.35 : 1,
      }}
    >
      <span className="bt-rank" style={{ color: groupColor }}>
        #{String(player.rank).padStart(2, "0")}
      </span>
      <div className="bt-player">
        <span className="bt-player__name">{player.name}</span>
        <span className="bt-player__pos">{player.position}</span>
      </div>
      {skills.map((sd) => {
        const active = selectedSkillIds.includes(sd.id);
        const skill = player.skills.find((s) => s.id === sd.id);
        const display = player.isDummy ? "–" : (skill?.lvl ?? "–");
        return (
          <span
            key={sd.id}
            className={`bt-skill ${active ? "bt-skill--active" : "bt-skill--inactive"}`}
            style={active ? { color: accentColor } : undefined}
          >
            {display}
          </span>
        );
      })}
      <span className="bt-ovr">{player.subOvr}</span>
    </div>
  );
}

export function BubbleTable({ players, category, accentColor }: BubbleTableProps) {
  const isGoalie = category.isGoalie ?? false;
  const skills = isGoalie ? GOALIE_SKILLS : SKATER_SKILLS;
  const selectedSkillIds = category.skillIds;
  // const groupSize = isGoalie ? GOALIE_GROUP_SIZE : GROUP_SIZE;
  const weights = category.weights ?? [...GROUP_WEIGHTS];

  useFlip(FLIP_ROOT_ID, { duration: 400 });

  const ranked = players.filter((p) => !p.isBench);
  const bench = players.filter((p) => p.isBench);
  const groups = groupBy(ranked);

  const gridCols = `40px 2fr repeat(${skills.length}, 1fr) 70px`;

  return (
    <div>
      {/* headers offset to align with rows inside groups */}
      <div className="bt-group-layout">
        <div className="bt-group-bracket-spacer" />
        <div style={{ flex: 1 }}>
          <SkillHeaders
            skills={skills}
            selectedSkillIds={selectedSkillIds}
            accentColor={accentColor}
            gridCols={gridCols}
          />
        </div>
      </div>

      {/* ranked groups */}
      <div data-flip-root-id={FLIP_ROOT_ID}>
        {groups.map((group, gi) => {
          const groupColor = getGroupColor(group[0].groupIndex);
          const weightPct = weights[gi] != null ? `${Math.round(weights[gi] * 100)}%` : null;

          return (
            <div key={gi} className={`bt-group ${gi > 0 ? "bt-group--gap" : ""}`}>
              <div className="bt-group-layout">
                {/* side bracket with weight */}
                <div className="bt-group-bracket" style={{ borderColor: groupColor }}>
                  {weightPct && (
                    <span className="bt-group-bracket__label" style={{ color: groupColor }}>
                      {weightPct}
                    </span>
                  )}
                </div>

                {/* rows */}
                <div className="bt-group-rows">
                  {group.map((player, ri) => (
                    <div
                      key={toFlipId(player)}
                      data-flip-id={toFlipId(player)}
                      className={ri === 0 ? "bt-row-first" : "bt-row-no-gap"}
                    >
                      <PlayerRow
                        player={player}
                        skills={skills}
                        selectedSkillIds={selectedSkillIds}
                        accentColor={accentColor}
                        gridCols={gridCols}
                        groupColor={groupColor}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* bench */}
      {bench.length > 0 && (
        <div className="bt-bench-section">
          <div className="bt-group-layout">
            <div className="bt-group-bracket-spacer" />
            <div style={{ flex: 1 }}>
              <div className="bt-bench-divider" />
            </div>
          </div>
          <div className="bt-group-layout">
            <div className="bt-group-bracket-spacer" />
            <div className="bt-group-rows">
              {bench.map((player, i) => (
                <div
                  key={`bench-${player.name}-${i}`}
                  className={i === 0 ? "bt-row-first" : "bt-row-no-gap"}
                >
                  <div
                    className="bt-row bt-row--bench"
                    style={{
                      display: "grid",
                      gridTemplateColumns: gridCols,
                      gap: 8,
                      borderLeft: "4px solid #333",
                    }}
                  >
                    <span className="bt-rank" style={{ color: "#555" }}>
                      #{String(player.rank).padStart(2, "0")}
                    </span>
                    <div className="bt-player">
                      <span className="bt-player__name" style={{ color: "#666" }}>
                        {player.name}
                      </span>
                      <span className="bt-player__pos">{player.position}</span>
                    </div>
                    {skills.map((sd) => {
                      const active = selectedSkillIds.includes(sd.id);
                      const skill = player.skills.find((s) => s.id === sd.id);
                      return (
                        <span
                          key={sd.id}
                          className={`bt-skill ${active ? "bt-skill--active" : "bt-skill--inactive"}`}
                          style={active ? { color: accentColor, opacity: 0.5 } : undefined}
                        >
                          {skill?.lvl ?? "–"}
                        </span>
                      );
                    })}
                    <span className="bt-ovr" style={{ color: "#555" }}>{player.subOvr}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
