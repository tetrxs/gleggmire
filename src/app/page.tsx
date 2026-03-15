import { XpWindow } from "@/components/ui/xp-window";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome window */}
      <XpWindow title="Gleggmire-Enzyklopaedie -- Willkommen.exe">
        <div className="flex flex-col gap-4">
          <p className="text-[13px] leading-relaxed">
            Willkommen bei <strong>gleggmire.net</strong> &mdash; dem inoffiziellen Glossar
            und Clip-Archiv rund um den YouTuber Gleggmire. Hier findest du alle Insider,
            Running Gags und legendaeren Momente, gesammelt und erklaert von der Community.
          </p>
          <p className="text-[12px]" style={{ color: "var(--xp-border-dark)" }}>
            Stoebre durch das Glossar, entdecke Clips oder reiche selbst neue Begriffe ein.
          </p>
        </div>
      </XpWindow>

      {/* Placeholder sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Begriff des Tages */}
        <XpWindow title="Begriff des Tages">
          <div className="flex h-32 items-center justify-center">
            <p
              className="text-center text-[12px] italic"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Hier erscheint bald der taegliche Featured-Begriff...
            </p>
          </div>
        </XpWindow>

        {/* Top Clips */}
        <XpWindow title="Top Clips">
          <div className="flex h-32 items-center justify-center">
            <p
              className="text-center text-[12px] italic"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Die beliebtesten Clips der Woche...
            </p>
          </div>
        </XpWindow>

        {/* Aktivitaets-Feed */}
        <XpWindow title="Aktivitaets-Feed">
          <div className="flex h-32 items-center justify-center">
            <p
              className="text-center text-[12px] italic"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Letzte Community-Aktivitaeten...
            </p>
          </div>
        </XpWindow>
      </div>
    </div>
  );
}
