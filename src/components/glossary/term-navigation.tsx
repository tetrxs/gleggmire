interface TermNavigationProps {
  prev: { term: string; slug: string } | null;
  next: { term: string; slug: string } | null;
}

export function TermNavigation({ prev, next }: TermNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="flex items-center justify-between mb-4">
      {prev ? (
        <a
          href={`/glossar/${prev.slug}`}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
          style={{ color: "var(--color-text-muted)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          title={prev.term}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="hidden sm:inline max-w-[120px] truncate">{prev.term}</span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a
          href={`/glossar/${next.slug}`}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
          style={{ color: "var(--color-text-muted)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          title={next.term}
        >
          <span className="hidden sm:inline max-w-[120px] truncate">{next.term}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </a>
      ) : (
        <span />
      )}
    </div>
  );
}
