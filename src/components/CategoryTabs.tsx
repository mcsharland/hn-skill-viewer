import type { Category } from "../types";
import { getTabColor } from "../constants";

interface CategoryTabsProps {
  categories: Category[];
  activeId: string;
  ratings: Record<string, number | null>;
  onSelect: (id: string) => void;
}

export function CategoryTabs({
  categories,
  activeId,
  ratings,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="category-tabs">
      {categories.map((cat, i) => {
        const active = cat.id === activeId;
        const color = getTabColor(i);
        const rating = ratings[cat.id] ?? null;
        return (
          <button
            key={cat.id}
            className="category-tabs__btn"
            onClick={() => onSelect(cat.id)}
            style={{
              color: active ? "#000" : undefined,
              background: active ? color : undefined,
              boxShadow: active ? `0 2px 16px ${color}44` : undefined,
            }}
          >
            <span className="category-tabs__btn-label">{cat.label}</span>
            {rating !== null && (
              <span
                className="category-tabs__btn-rating"
                style={{ opacity: active ? 0.7 : undefined }}
              >
                {rating}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
