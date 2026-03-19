import Link from "next/link";

interface TermNavigationProps {
  prev: { term: string; slug: string } | null;
  next: { term: string; slug: string } | null;
}

export function TermNavigation({ prev, next }: TermNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="flex items-center justify-between mb-4">
      {prev ? (
        <Link
          href={`/glossar/${prev.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[var(--color-accent)]"
          style={{ color: "var(--color-text-muted)" }}
          title={prev.term}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="hidden sm:inline">{prev.term}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/glossar/${next.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[var(--color-accent)]"
          style={{ color: "var(--color-text-muted)" }}
          title={next.term}
        >
          <span className="hidden sm:inline">{next.term}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
