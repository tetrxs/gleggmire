"use client";

const PREDEFINED_TAGS = [
  "GTA RP",
  "Trolling",
  "Reaktionen",
  "Cops",
  "Meta",
  "Lore",
  "Slang",
  "Vulgär",
  "Humor",
  "Essen",
  "Getränke",
  "Personen",
  "Insider",
  "Begrüßung",
  "Aktion",
  "Objekte",
  "Gefühl",
  "Sprüche",
] as const;

interface TagSelectProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export function TagSelect({ selectedTags, onChange }: TagSelectProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PREDEFINED_TAGS.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 select-none ${
              isSelected
                ? "bg-[var(--color-accent)] text-white shadow-sm"
                : "hover:bg-[var(--color-border)]"
            }`}
            style={{
              ...(isSelected
                ? {}
                : {
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                  }),
            }}
            aria-pressed={isSelected}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
