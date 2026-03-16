"use client";

import { useState } from "react";
import { REACTIONS } from "@/lib/constants/reactions";
import type { ReactionType } from "@/types/database";

interface ReactionCount { type: ReactionType; count: number; }
interface ReactionBarProps { reactions?: ReactionCount[]; commentId?: string; }

export function ReactionBar({ reactions = [], commentId }: ReactionBarProps) {
  const [localReactions, setLocalReactions] = useState<Map<ReactionType, { count: number; active: boolean }>>(() => {
    const map = new Map<ReactionType, { count: number; active: boolean }>();
    for (const r of reactions) map.set(r.type, { count: r.count, active: false });
    return map;
  });

  async function toggleReaction(type: ReactionType) {
    // Optimistic update
    const prev = new Map(localReactions);
    setLocalReactions((current) => {
      const next = new Map(current);
      const state = next.get(type);
      if (state) next.set(type, { count: state.active ? state.count - 1 : state.count + 1, active: !state.active });
      else next.set(type, { count: 1, active: true });
      return next;
    });

    if (!commentId) return;

    try {
      const res = await fetch(`/api/v1/comments/${commentId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction_type: type }),
      });

      if (!res.ok) {
        // Rollback on failure
        setLocalReactions(prev);
      }
    } catch {
      // Rollback on network error
      setLocalReactions(prev);
    }
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
                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
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
