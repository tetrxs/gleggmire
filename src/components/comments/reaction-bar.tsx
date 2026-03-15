"use client";

import { useState } from "react";
import { REACTIONS } from "@/lib/constants/reactions";
import type { ReactionType } from "@/types/database";

interface ReactionCount {
  type: ReactionType;
  count: number;
}

interface ReactionBarProps {
  reactions?: ReactionCount[];
}

export function ReactionBar({ reactions = [] }: ReactionBarProps) {
  const [localReactions, setLocalReactions] = useState<
    Map<ReactionType, { count: number; active: boolean }>
  >(() => {
    const map = new Map<ReactionType, { count: number; active: boolean }>();
    for (const r of reactions) {
      map.set(r.type, { count: r.count, active: false });
    }
    return map;
  });

  function toggleReaction(type: ReactionType) {
    setLocalReactions((prev) => {
      const next = new Map(prev);
      const current = next.get(type);
      if (current) {
        next.set(type, {
          count: current.active ? current.count - 1 : current.count + 1,
          active: !current.active,
        });
      } else {
        next.set(type, { count: 1, active: true });
      }
      return next;
    });
  }

  return (
    <div className="flex flex-wrap gap-1">
      {REACTIONS.map((def) => {
        const state = localReactions.get(def.type);
        const count = state?.count ?? 0;
        const active = state?.active ?? false;

        return (
          <button
            key={def.type}
            type="button"
            onClick={() => toggleReaction(def.type)}
            title={def.description}
            className={`
              xp-raised flex items-center gap-1 px-1.5 py-0.5 text-[10px]
              transition-colors cursor-pointer select-none
              ${active ? "!bg-[var(--xp-blau-highlight)] !text-white" : "hover:!bg-[var(--xp-silber-luna)]"}
              ${count === 0 && !active ? "opacity-50" : ""}
            `}
            style={{ fontFamily: "Tahoma, Verdana, sans-serif" }}
          >
            <span>{def.emoji}</span>
            <span className="font-bold">{def.label}</span>
            {count > 0 && <span className="opacity-75">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
