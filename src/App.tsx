import { useState, useMemo } from "react";
import type { Player } from "./types";
import { CATEGORIES, getTabColor } from "./constants";
import { rankPlayers, calculateTeamRating } from "./scoring";
import { FileUpload } from "./components/FileUpload";
import { CategoryTabs } from "./components/CategoryTabs";
import { BubbleTable } from "./components/BubbleTable";

export default function App() {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0].id);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId)!;
  const activeIndex = CATEGORIES.findIndex((c) => c.id === activeCategoryId);
  const accentColor = getTabColor(activeIndex);

  const ranked = useMemo(
    () => (players ? rankPlayers(players, activeCategory) : []),
    [players, activeCategory],
  );

  // team rating for every category
  const allRatings = useMemo(() => {
    if (!players) return {};
    const out: Record<string, number | null> = {};
    for (const cat of CATEGORIES) {
      const r = rankPlayers(players, cat);
      out[cat.id] = r.length > 0 ? calculateTeamRating(r, cat) : null;
    }
    return out;
  }, [players]);

  return (
    <div className="app">
      <div className="app__container">
        <div className="app__header">
          <h1 className="app__title">Hockey Nation Skill Viewer</h1>
          <p className="app__subtitle">
            Upload a Hockey Nation skill export to view, sort, and analyze your
            roster.
          </p>
        </div>

        {!players ? (
          <FileUpload onParsed={setPlayers} />
        ) : (
          <div className="app__content">
            <div className="app__toolbar">
              <div className="app__toolbar-tabs">
                <CategoryTabs
                  categories={CATEGORIES}
                  activeId={activeCategoryId}
                  ratings={allRatings}
                  onSelect={setActiveCategoryId}
                />
              </div>
              <button className="btn-reset" onClick={() => setPlayers(null)}>
                New File
              </button>
            </div>

            <div className="app__panel">
              <BubbleTable
                players={ranked}
                category={activeCategory}
                accentColor={accentColor}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
