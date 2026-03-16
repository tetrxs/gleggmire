"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditTermModal } from "@/components/glossary/edit-term-modal";
import { EditDefinitionModal } from "@/components/glossary/edit-definition-modal";
import { EditCommentModal } from "@/components/comments/edit-comment-modal";
import type { GlossaryTerm, TermDefinition, Comment } from "@/types/database";

// ---------- Types ----------

type DefinitionWithTerm = TermDefinition & {
  term_name: string;
  term_slug: string;
};

type CommentWithTerm = Comment & {
  term_name: string;
  term_slug: string;
};

type Tab = "terms" | "definitions" | "comments";

interface MyEntriesViewProps {
  terms: GlossaryTerm[];
  definitions: DefinitionWithTerm[];
  comments: CommentWithTerm[];
}

// ---------- Constants ----------

const ITEMS_PER_PAGE = 3;

const TAB_CONFIG: { key: Tab; label: string }[] = [
  { key: "terms", label: "Begriffe" },
  { key: "definitions", label: "Definitionen" },
  { key: "comments", label: "Kommentare" },
];

// ---------- Icons ----------

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ---------- Helpers ----------

function truncate(text: string | undefined, max: number): string {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function statusLabel(status: string): { text: string; color: string } | null {
  switch (status) {
    case "pending":
      return { text: "Ausstehend", color: "var(--color-warning, #f59e0b)" };
    case "disputed":
      return { text: "Umstritten", color: "var(--color-error, #ef4444)" };
    case "locked":
      return { text: "Gesperrt", color: "var(--color-text-muted)" };
    case "rejected":
      return { text: "Abgelehnt", color: "var(--color-error, #ef4444)" };
    default:
      return null;
  }
}

// ---------- Component ----------

export function MyEntriesView({ terms: initialTerms, definitions: initialDefs, comments: initialComments }: MyEntriesViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("terms");
  const [search, setSearch] = useState("");

  // Local state for each dataset (so we can remove items on delete)
  const [terms, setTerms] = useState(initialTerms);
  const [definitions, setDefinitions] = useState(initialDefs);
  const [comments, setComments] = useState(initialComments);

  // Pagination state per tab
  const [termsVisible, setTermsVisible] = useState(ITEMS_PER_PAGE);
  const [defsVisible, setDefsVisible] = useState(ITEMS_PER_PAGE);
  const [commentsVisible, setCommentsVisible] = useState(ITEMS_PER_PAGE);

  // Edit modals
  const [editTerm, setEditTerm] = useState<GlossaryTerm | null>(null);
  const [editDef, setEditDef] = useState<DefinitionWithTerm | null>(null);
  const [editComment, setEditComment] = useState<CommentWithTerm | null>(null);

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtered data
  const query = search.toLowerCase().trim();

  const filteredTerms = useMemo(
    () => query ? terms.filter((t) => t.term.toLowerCase().includes(query)) : terms,
    [terms, query],
  );

  const filteredDefs = useMemo(
    () =>
      query
        ? definitions.filter(
            (d) =>
              d.definition.toLowerCase().includes(query) ||
              d.term_name.toLowerCase().includes(query),
          )
        : definitions,
    [definitions, query],
  );

  const filteredComments = useMemo(
    () =>
      query
        ? comments.filter(
            (c) =>
              (c.text ?? "").toLowerCase().includes(query) ||
              c.term_name.toLowerCase().includes(query),
          )
        : comments,
    [comments, query],
  );

  // Reset pagination on search change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setTermsVisible(ITEMS_PER_PAGE);
    setDefsVisible(ITEMS_PER_PAGE);
    setCommentsVisible(ITEMS_PER_PAGE);
  };

  // Reset pagination on tab change
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearch("");
    setTermsVisible(ITEMS_PER_PAGE);
    setDefsVisible(ITEMS_PER_PAGE);
    setCommentsVisible(ITEMS_PER_PAGE);
  };

  // ---------- Delete handlers ----------

  const handleDeleteTerm = async (term: GlossaryTerm) => {
    if (!confirm("Begriff wirklich loeschen? Alle zugehoerigen Definitionen und Kommentare werden ebenfalls entfernt.")) return;
    setDeletingId(term.id);
    try {
      const res = await fetch(`/api/v1/terms/${term.slug}`, { method: "DELETE" });
      if (res.ok) {
        setTerms((prev) => prev.filter((t) => t.id !== term.id));
      } else {
        const errorText = await res.text().catch(() => "Unbekannter Fehler");
        alert("Fehler beim Loeschen: " + errorText);
      }
    } catch (err) {
      alert("Netzwerkfehler: " + (err instanceof Error ? err.message : "Unbekannt"));
    }
    setDeletingId(null);
  };

  const handleDeleteDef = async (def: DefinitionWithTerm) => {
    if (!confirm("Definition wirklich loeschen?")) return;
    setDeletingId(def.id);
    try {
      const res = await fetch(`/api/v1/terms/${def.term_slug}/definitions/${def.id}`, { method: "DELETE" });
      if (res.ok) {
        setDefinitions((prev) => prev.filter((d) => d.id !== def.id));
      } else {
        const errorText = await res.text().catch(() => "Unbekannter Fehler");
        alert("Fehler beim Loeschen: " + errorText);
      }
    } catch (err) {
      alert("Netzwerkfehler: " + (err instanceof Error ? err.message : "Unbekannt"));
    }
    setDeletingId(null);
  };

  const handleDeleteComment = async (comment: CommentWithTerm) => {
    if (!confirm("Kommentar wirklich loeschen?")) return;
    setDeletingId(comment.id);
    try {
      const res = await fetch(`/api/v1/comments/${comment.id}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== comment.id));
      } else {
        const errorText = await res.text().catch(() => "Unbekannter Fehler");
        alert("Fehler beim Loeschen: " + errorText);
      }
    } catch (err) {
      alert("Netzwerkfehler: " + (err instanceof Error ? err.message : "Unbekannt"));
    }
    setDeletingId(null);
  };

  // ---------- Counts ----------

  const counts: Record<Tab, number> = {
    terms: terms.length,
    definitions: definitions.length,
    comments: comments.length,
  };

  // ---------- Render ----------

  return (
    <div className="py-10">
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ color: "var(--color-text)" }}
        >
          Meins
        </h1>
        <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
          Deine Begriffe, Definitionen und Kommentare
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-5">
        <div className="inline-flex rounded-lg p-0.5" style={{ border: "1px solid var(--color-border)" }}>
          {TAB_CONFIG.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTabChange(key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === key
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {label} ({counts[key]})
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" style={{ color: "var(--color-text-muted)" }}>
          <SearchIcon />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Suchen..."
          className="w-full rounded-lg border py-2 pl-9 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
        />
      </div>

      {/* Tab content */}
      {activeTab === "terms" && (
        <TermsList
          items={filteredTerms}
          visibleCount={termsVisible}
          onShowMore={() => setTermsVisible((v) => v + ITEMS_PER_PAGE)}
          onEdit={setEditTerm}
          onDelete={handleDeleteTerm}
          deletingId={deletingId}
        />
      )}

      {activeTab === "definitions" && (
        <DefinitionsList
          items={filteredDefs}
          visibleCount={defsVisible}
          onShowMore={() => setDefsVisible((v) => v + ITEMS_PER_PAGE)}
          onEdit={setEditDef}
          onDelete={handleDeleteDef}
          deletingId={deletingId}
        />
      )}

      {activeTab === "comments" && (
        <CommentsList
          items={filteredComments}
          visibleCount={commentsVisible}
          onShowMore={() => setCommentsVisible((v) => v + ITEMS_PER_PAGE)}
          onEdit={setEditComment}
          onDelete={handleDeleteComment}
          deletingId={deletingId}
        />
      )}

      {/* Edit modals */}
      {editTerm && (
        <EditTermModal
          open
          onClose={() => setEditTerm(null)}
          term={editTerm}
          onSaved={() => router.refresh()}
        />
      )}

      {editDef && (
        <EditDefinitionModal
          open
          onClose={() => setEditDef(null)}
          definition={editDef}
          termSlug={editDef.term_slug}
          onSaved={() => router.refresh()}
        />
      )}

      {editComment && (
        <EditCommentModal
          open
          onClose={() => setEditComment(null)}
          comment={editComment}
          onSaved={() => router.refresh()}
        />
      )}
    </div>
  );
}

// ---------- Sub-components ----------

function EmptyState({ text }: { text: string }) {
  return (
    <div
      className="flex h-24 items-center justify-center rounded-lg text-sm"
      style={{ border: "1px dashed var(--color-border)", color: "var(--color-text-muted)" }}
    >
      {text}
    </div>
  );
}

function ShowMoreButton({ remaining, onClick }: { remaining: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 w-full py-2 text-center text-xs font-medium transition-colors hover:underline"
      style={{ color: "var(--color-text-muted)" }}
    >
      Mehr anzeigen ({remaining} weitere)
    </button>
  );
}

function ActionButtons({
  onEdit,
  onDelete,
  isDeleting,
}: {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={onEdit}
        className="flex h-7 w-7 items-center justify-center rounded transition-colors"
        style={{ color: "var(--color-text-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        title="Bearbeiten"
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="flex h-7 w-7 items-center justify-center rounded transition-colors"
        style={{ color: "var(--color-text-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-error, #ef4444)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        title="Loeschen"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

// ---------- Terms list ----------

function TermsList({
  items,
  visibleCount,
  onShowMore,
  onEdit,
  onDelete,
  deletingId,
}: {
  items: GlossaryTerm[];
  visibleCount: number;
  onShowMore: () => void;
  onEdit: (term: GlossaryTerm) => void;
  onDelete: (term: GlossaryTerm) => void;
  deletingId: string | null;
}) {
  if (items.length === 0) return <EmptyState text="Keine Begriffe gefunden." />;

  const visible = items.slice(0, visibleCount);
  const remaining = items.length - visibleCount;

  return (
    <div>
      <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
        {visible.map((term) => {
          const badge = statusLabel(term.status);
          return (
            <div key={term.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/glossar/${term.slug}`}
                    className="text-sm font-semibold truncate hover:text-[var(--color-accent)] transition-colors"
                    style={{ color: "var(--color-text)" }}
                  >
                    {term.term}
                  </Link>
                  {badge && (
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        color: badge.color,
                        border: `1px solid ${badge.color}`,
                        backgroundColor: "transparent",
                      }}
                    >
                      {badge.text}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                  {formatDate(term.created_at)}
                </p>
              </div>
              <ActionButtons
                onEdit={() => onEdit(term)}
                onDelete={() => onDelete(term)}
                isDeleting={deletingId === term.id}
              />
            </div>
          );
        })}
      </div>
      {remaining > 0 && <ShowMoreButton remaining={remaining} onClick={onShowMore} />}
    </div>
  );
}

// ---------- Definitions list ----------

function DefinitionsList({
  items,
  visibleCount,
  onShowMore,
  onEdit,
  onDelete,
  deletingId,
}: {
  items: DefinitionWithTerm[];
  visibleCount: number;
  onShowMore: () => void;
  onEdit: (def: DefinitionWithTerm) => void;
  onDelete: (def: DefinitionWithTerm) => void;
  deletingId: string | null;
}) {
  if (items.length === 0) return <EmptyState text="Keine Definitionen gefunden." />;

  const visible = items.slice(0, visibleCount);
  const remaining = items.length - visibleCount;

  return (
    <div>
      <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
        {visible.map((def) => {
          const badge = statusLabel(def.status);
          return (
            <div key={def.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>
                  {truncate(def.definition, 100)}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                  <span>
                    auf:{" "}
                    <Link
                      href={`/glossar/${def.term_slug}`}
                      className="font-medium hover:text-[var(--color-accent)] transition-colors"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {def.term_name}
                    </Link>
                  </span>
                  {badge && (
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        color: badge.color,
                        border: `1px solid ${badge.color}`,
                        backgroundColor: "transparent",
                      }}
                    >
                      {badge.text}
                    </span>
                  )}
                </div>
              </div>
              <ActionButtons
                onEdit={() => onEdit(def)}
                onDelete={() => onDelete(def)}
                isDeleting={deletingId === def.id}
              />
            </div>
          );
        })}
      </div>
      {remaining > 0 && <ShowMoreButton remaining={remaining} onClick={onShowMore} />}
    </div>
  );
}

// ---------- Comments list ----------

function CommentsList({
  items,
  visibleCount,
  onShowMore,
  onEdit,
  onDelete,
  deletingId,
}: {
  items: CommentWithTerm[];
  visibleCount: number;
  onShowMore: () => void;
  onEdit: (comment: CommentWithTerm) => void;
  onDelete: (comment: CommentWithTerm) => void;
  deletingId: string | null;
}) {
  if (items.length === 0) return <EmptyState text="Keine Kommentare gefunden." />;

  const visible = items.slice(0, visibleCount);
  const remaining = items.length - visibleCount;

  return (
    <div>
      <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
        {visible.map((comment) => (
          <div key={comment.id} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>
                {comment.text ? truncate(comment.text, 100) : (comment.attachment_type ? `[${comment.attachment_type}]` : "[Kein Text]")}
              </p>
              <p className="mt-0.5 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                auf:{" "}
                <Link
                  href={`/glossar/${comment.term_slug}`}
                  className="font-medium hover:text-[var(--color-accent)] transition-colors"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {comment.term_name}
                </Link>
                <span className="ml-2">{formatDate(comment.created_at)}</span>
              </p>
            </div>
            <ActionButtons
              onEdit={() => onEdit(comment)}
              onDelete={() => onDelete(comment)}
              isDeleting={deletingId === comment.id}
            />
          </div>
        ))}
      </div>
      {remaining > 0 && <ShowMoreButton remaining={remaining} onClick={onShowMore} />}
    </div>
  );
}
