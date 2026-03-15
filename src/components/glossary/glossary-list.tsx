"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import type { GlossaryTerm, TermDefinition, TermTag } from "@/types/database";
import { XpButton } from "@/components/ui/xp-button";
import { GlossaryCard } from "@/components/glossary/glossary-card";

type SortMode = "az" | "za" | "newest" | "oldest";

interface GlossaryListProps {
  terms: GlossaryTerm[];
  definitions: TermDefinition[];
  tags: TermTag[];
}

export function GlossaryList({ terms, definitions, tags }: GlossaryListProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("az");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
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
      // Keep the one with the most upvotes per term
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

    // Search filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((t) => t.term.toLowerCase().includes(q));
    }

    // Tag filter
    if (activeTag) {
      const termIdsWithTag = new Set(
        tags.filter((t) => t.tag === activeTag).map((t) => t.term_id),
      );
      result = result.filter((t) => termIdsWithTag.has(t.id));
    }

    // Sort
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

  return (
    <div className="flex flex-col gap-4">
      {/* Search field */}
      <div className="xp-inset flex items-center gap-2 p-1" style={{ backgroundColor: "#FFFFFF" }}>
        <span className="xp-text-label pl-1" style={{ color: "var(--xp-border-dark)" }}>
          Suche:
        </span>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Begriff eingeben..."
          className="flex-1 bg-transparent px-1 py-[2px] text-[12px] outline-none"
          style={{ fontFamily: "Tahoma, Verdana, sans-serif" }}
        />
      </div>

      {/* Sort & filter controls */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="xp-text-label font-bold">Sortierung:</span>
        <XpButton
          onClick={() => setSortMode("az")}
          className={sortMode === "az" ? "xp-button-pressed" : ""}
        >
          A-Z
        </XpButton>
        <XpButton
          onClick={() => setSortMode("za")}
          className={sortMode === "za" ? "xp-button-pressed" : ""}
        >
          Z-A
        </XpButton>
        <XpButton
          onClick={() => setSortMode("newest")}
          className={sortMode === "newest" ? "xp-button-pressed" : ""}
        >
          Neueste
        </XpButton>
        <XpButton
          onClick={() => setSortMode("oldest")}
          className={sortMode === "oldest" ? "xp-button-pressed" : ""}
        >
          Aelteste
        </XpButton>
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="xp-text-label font-bold">Kategorie:</span>
        <XpButton
          onClick={() => setActiveTag(null)}
          className={activeTag === null ? "xp-button-pressed" : ""}
        >
          Alle
        </XpButton>
        {allTags.map((tag) => (
          <XpButton
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={activeTag === tag ? "xp-button-pressed" : ""}
          >
            {tag}
          </XpButton>
        ))}
      </div>

      {/* Result count */}
      <div
        className="xp-inset px-2 py-1"
        style={{ backgroundColor: "#F1EFE2" }}
      >
        <span className="xp-text-label">
          {filteredTerms.length} Begriffe gefunden
        </span>
      </div>

      {/* Cards grid */}
      {filteredTerms.length === 0 ? (
        <div className="flex h-24 items-center justify-center">
          <p
            className="text-center text-[12px] italic"
            style={{ color: "var(--xp-border-dark)" }}
          >
            Keine Begriffe gefunden. Versuch einen anderen Suchbegriff.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTerms.map((term) => (
            <GlossaryCard
              key={term.id}
              term={term}
              definition={definitionMap.get(term.id)}
              tags={tagMap.get(term.id) ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
