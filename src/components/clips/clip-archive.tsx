"use client";

import { useState, useMemo } from "react";
import { ClipCard } from "@/components/clips/clip-card";
import type { MockClipData } from "@/lib/mock-clips";

type SortTab = "hot" | "new" | "top";

interface ClipArchiveProps {
  clips: MockClipData[];
}

function collectTerms(clips: MockClipData[]) {
  const map = new Map<string, { id: string; term: string; slug: string }>();
  for (const c of clips) {
    for (const lt of c.linkedTerms) {
      map.set(lt.id, lt);
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.term.localeCompare(b.term, "de")
  );
}

export function ClipArchive({ clips }: ClipArchiveProps) {
  const [sortTab, setSortTab] = useState<SortTab>("hot");
  const [filterTermId, setFilterTermId] = useState<string>("");

  const allTerms = useMemo(() => collectTerms(clips), [clips]);

  const filtered = useMemo(() => {
    let result = [...clips];
    if (filterTermId) {
      result = result.filter((c) =>
        c.linkedTerms.some((lt) => lt.id === filterTermId)
      );
    }
    switch (sortTab) {
      case "hot":
        result.sort((a, b) => {
          const scoreA = a.clip.upvotes / (1 + (Date.now() - new Date(a.clip.submitted_at).getTime()) / 86400000);
          const scoreB = b.clip.upvotes / (1 + (Date.now() - new Date(b.clip.submitted_at).getTime()) / 86400000);
          return scoreB - scoreA;
        });
        break;
      case "new":
        result.sort((a, b) => new Date(b.clip.submitted_at).getTime() - new Date(a.clip.submitted_at).getTime());
        break;
      case "top":
        result.sort((a, b) => b.clip.upvotes - a.clip.upvotes);
        break;
    }
    return result;
  }, [clips, sortTab, filterTermId]);

  const tabs: { key: SortTab; label: string }[] = [
    { key: "hot", label: "Hot" },
    { key: "new", label: "New" },
    { key: "top", label: "Top" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-[var(--color-border)] p-1 dark:border-zinc-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSortTab(tab.key)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                sortTab === tab.key
                  ? "bg-[#E8593C] text-white"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="clip-term-filter" className="text-sm text-[var(--color-muted)]">
            Begriff:
          </label>
          <select
            id="clip-term-filter"
            value={filterTermId}
            onChange={(e) => setFilterTermId(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[#E8593C] dark:border-zinc-700"
          >
            <option value="">Alle Begriffe</option>
            {allTerms.map((t) => (
              <option key={t.id} value={t.id}>{t.term}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-[var(--color-muted)]">
        {filtered.length} Clip{filtered.length !== 1 ? "s" : ""} gefunden
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((clipData) => (
            <ClipCard key={clipData.clip.id} data={clipData} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] p-12 text-center dark:border-zinc-700">
          <p className="text-sm text-[var(--color-muted)]">
            Keine Clips gefunden. Versuch einen anderen Filter.
          </p>
        </div>
      )}
    </div>
  );
}
