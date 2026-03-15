"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import type { GlossaryTerm, TermDefinition, TermTag } from "@/types/database";
import { GlossaryCard } from "@/components/glossary/glossary-card";

type SortMode = "az" | "za" | "newest" | "oldest";

const ITEMS_PER_PAGE = 24;

interface GlossaryListProps {
  terms: GlossaryTerm[];
  definitions: TermDefinition[];
  tags: TermTag[];
}

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
  { value: "newest", label: "Neueste" },
  { value: "oldest", label: "Älteste" },
];

export function GlossaryList({ terms, definitions, tags }: GlossaryListProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("az");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setPage(1);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setDebouncedSearch(value);
      }, 300);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tags.forEach((t) => tagSet.add(t.tag));
    return Array.from(tagSet).sort();
  }, [tags]);

  // Build lookup maps
  const definitionMap = useMemo(() => {
    const map = new Map<string, TermDefinition>();
    for (const def of definitions) {
      const existing = map.get(def.term_id);
      if (!existing || def.upvotes > existing.upvotes) {
        map.set(def.term_id, def);
      }
    }
    return map;
  }, [definitions]);

  const tagMap = useMemo(() => {
    const map = new Map<string, TermTag[]>();
    for (const tag of tags) {
      const list = map.get(tag.term_id) ?? [];
      list.push(tag);
      map.set(tag.term_id, list);
    }
    return map;
  }, [tags]);

  // Filter and sort
  const filteredTerms = useMemo(() => {
    let result = terms;

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((t) => t.term.toLowerCase().includes(q));
    }

    if (activeTag) {
      const termIdsWithTag = new Set(
        tags.filter((t) => t.tag === activeTag).map((t) => t.term_id),
      );
      result = result.filter((t) => termIdsWithTag.has(t.id));
    }

    result = [...result].sort((a, b) => {
      switch (sortMode) {
        case "az":
          return a.term.localeCompare(b.term, "de");
        case "za":
          return b.term.localeCompare(a.term, "de");
        case "newest":
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );
      }
    });

    return result;
  }, [terms, debouncedSearch, activeTag, sortMode, tags]);

  const totalPages = Math.ceil(filteredTerms.length / ITEMS_PER_PAGE);
  const pagedTerms = useMemo(
    () => filteredTerms.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filteredTerms, page],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Begriff suchen..."
          className="w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text)",
          }}
        />
      </div>

      {/* Sort & filter row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Sort pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
            Sortierung:
          </span>
          <div className="flex gap-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => { setSortMode(option.value); setPage(1); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  sortMode === option.value
                    ? "bg-[var(--color-accent)] text-white shadow-sm"
                    : "hover:bg-[var(--color-border)]"
                }`}
                style={
                  sortMode !== option.value
                    ? { color: "var(--color-text)" }
                    : undefined
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <span
          className="text-xs tabular-nums"
          style={{ color: "var(--color-muted)" }}
        >
          {filteredTerms.length} Begriffe
        </span>
      </div>

      {/* Tag filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
          Kategorie:
        </span>
        <button
          type="button"
          onClick={() => { setActiveTag(null); setPage(1); }}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${
            activeTag === null
              ? "bg-[var(--color-accent)] text-white"
              : "hover:bg-[var(--color-border)]"
          }`}
          style={{
            ...(activeTag !== null
              ? {
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                }
              : {}),
          }}
        >
          Alle
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => { setActiveTag(activeTag === tag ? null : tag); setPage(1); }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${
              activeTag === tag
                ? "bg-[var(--color-accent)] text-white"
                : "hover:bg-[var(--color-border)]"
            }`}
            style={{
              ...(activeTag !== tag
                ? {
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                  }
                : {}),
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {filteredTerms.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            Keine Begriffe gefunden. Versuch einen anderen Suchbegriff.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pagedTerms.map((term) => (
              <GlossaryCard
                key={term.id}
                term={term}
                definition={definitionMap.get(term.id)}
                tags={tagMap.get(term.id) ?? []}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
              >
                ‹
              </button>
              <span className="text-sm tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
