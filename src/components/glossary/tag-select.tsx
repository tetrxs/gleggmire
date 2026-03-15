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
    <div className="flex flex-wrap gap-[6px]">
      {PREDEFINED_TAGS.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className="xp-raised cursor-pointer px-2 py-[2px] text-[11px] transition-colors select-none"
            style={{
              backgroundColor: isSelected
                ? "var(--glegg-orange)"
                : "var(--xp-silber-luna)",
              color: isSelected ? "#FFFFFF" : "#000000",
              fontFamily: "Tahoma, Verdana, sans-serif",
              fontWeight: isSelected ? "bold" : "normal",
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
