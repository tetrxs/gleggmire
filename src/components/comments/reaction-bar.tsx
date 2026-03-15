"use client";

import { useState } from "react";
import { REACTIONS } from "@/lib/constants/reactions";
import type { ReactionType } from "@/types/database";

interface ReactionCount { type: ReactionType; count: number; }
interface ReactionBarProps { reactions?: ReactionCount[]; }

export function ReactionBar({ reactions = [] }: ReactionBarProps) {
  const [localReactions, setLocalReactions] = useState<Map<ReactionType, { count: number; active: boolean }>>(() => {
    const map = new Map<ReactionType, { count: number; active: boolean }>();
    for (const r of reactions) map.set(r.type, { count: r.count, active: false });
    return map;
  });

  function toggleReaction(type: ReactionType) {
    setLocalReactions((prev) => {
      const next = new Map(prev);
      const current = next.get(type);
      if (current) next.set(type, { count: current.active ? current.count - 1 : current.count + 1, active: !current.active });
      else next.set(type, { count: 1, active: true });
      return next;
    });
  }

  return (
    <div className="flex flex-wrap gap-1.5">
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
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer select-none border ${
              active
                ? "border-[#E8593C] bg-[#E8593C]/10 text-[#E8593C]"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-text)] hover:text-[var(--color-text)] dark:border-zinc-700"
            } ${count === 0 && !active ? "opacity-50" : ""}`}
          >
            <span>{def.emoji}</span>
            <span>{def.label}</span>
            {count > 0 && <span className="opacity-75">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
