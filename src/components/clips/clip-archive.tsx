"use client";

import { useState, useMemo } from "react";
import { XpButton } from "@/components/ui/xp-button";
import { ClipCard } from "@/components/clips/clip-card";
import type { MockClipData } from "@/lib/mock-clips";

type SortTab = "hot" | "new" | "top";

interface ClipArchiveProps {
  clips: MockClipData[];
}

/** Collect all unique glossary terms across all clips */
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

    // Filter by linked term
    if (filterTermId) {
      result = result.filter((c) =>
        c.linkedTerms.some((lt) => lt.id === filterTermId)
      );
    }

    // Sort
    switch (sortTab) {
      case "hot":
        // Hot = upvotes * recency factor
        result.sort((a, b) => {
          const scoreA =
            a.clip.upvotes /
            (1 +
              (Date.now() - new Date(a.clip.submitted_at).getTime()) /
                86400000);
          const scoreB =
            b.clip.upvotes /
            (1 +
              (Date.now() - new Date(b.clip.submitted_at).getTime()) /
                86400000);
          return scoreB - scoreA;
        });
        break;
      case "new":
        result.sort(
          (a, b) =>
            new Date(b.clip.submitted_at).getTime() -
            new Date(a.clip.submitted_at).getTime()
        );
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
    <div className="flex flex-col gap-3">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <XpButton
              key={tab.key}
              variant={sortTab === tab.key ? "primary" : "default"}
              onClick={() => setSortTab(tab.key)}
            >
              {tab.label}
            </XpButton>
          ))}
        </div>

        {/* Term filter dropdown */}
        <div className="flex items-center gap-1">
          <label
            htmlFor="clip-term-filter"
            className="xp-text-label text-[11px]"
          >
            Begriff:
          </label>
          <select
            id="clip-term-filter"
            value={filterTermId}
            onChange={(e) => setFilterTermId(e.target.value)}
            className="xp-sunken px-2 py-[2px] text-[11px]"
            style={{
              fontFamily: "Tahoma, Verdana, sans-serif",
              backgroundColor: "#FFF",
              border: "1px solid var(--xp-border-dark)",
            }}
          >
            <option value="">Alle Begriffe</option>
            {allTerms.map((t) => (
              <option key={t.id} value={t.id}>
                {t.term}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      <p
        className="xp-text-label text-[11px]"
        style={{ color: "#666" }}
      >
        {filtered.length} Clip{filtered.length !== 1 ? "s" : ""} gefunden
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((clipData) => (
            <ClipCard key={clipData.clip.id} data={clipData} />
          ))}
        </div>
      ) : (
        <div
          className="xp-sunken flex items-center justify-center p-8 text-center"
          style={{ fontFamily: "Tahoma, Verdana, sans-serif" }}
        >
          <p className="xp-text-label text-[12px]">
            Keine Clips gefunden. Versuch einen anderen Filter.
          </p>
        </div>
      )}
    </div>
  );
}
