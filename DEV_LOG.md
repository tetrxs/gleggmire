# Entwicklungsprotokoll — gleggmire.net

## Status: Phase 1 + Redesign abgeschlossen — Bereit für Supabase-Integration

### Commits
1. `8cd9ff4` — Initiales Setup: Next.js 16, Tailwind v4, XP Design-System, Layout, DB-Schema
2. `628c7af` — Glossar-System: Liste, Detail, Einreichen, Zufall, Änderungen, Seed-Daten
3. `3601113` — Clip-Archiv, Kommentar-System, Leaderboard & Community-Features
4. `041d1c5` — Troll-Features & Easter Eggs
5. `bdde653` — Discord OAuth, API Routes & Admin-Panel
6. `5ebd517` — DEV_LOG aktualisiert: Phase 1 abgeschlossen
7. `a6ab233` — Supabase DB live: Schema, RLS-Policies, ~79 Seed-Begriffe
8. `a32baff` — Komplettes Redesign: Clean/Modern mit Sketch-Akzenten, Dark/Light Mode
9. `d96cf58` — Redesign: Badge-Display & User-Profile-Card
10. `8b415d7` — Redesign: Admin, Troll, Community & statische Seiten

### Implementierte Features (22 Routen)

#### Kern-Features
- [x] Glossar-Liste mit Suche, Filterung (A-Z, Tags, Datum), GlossaryCards
- [x] Glossar-Detail mit Definitionen, Voting, Cope-O-Meter, Ratio'd-Banner
- [x] Begriff einreichen mit Live-Fuzzy-Matching (3-Stufen), Auto-Draft-Save
- [x] Öffentliche Moderations-Queue mit Community-Voting
- [x] Clip-Archiv mit Hot/New/Top-Filter, Badges (Hall of Fame, Clip der Woche)
- [x] Kommentar-System mit Attachment-Picker (Bild, GIF, YouTube, Twitch)
- [x] YouTube-Startpunkt-Scrubber im Editor
- [x] Globaler Mute-Toggle (Zustand Store)
- [x] Reaktions-System (W, L, Ratio, Cope, Seethe, Gegläggmirt, Kek)
- [x] Anonym-Modus ("Anonymer Schleimbeutel")
- [x] Leaderboard (Top Score, Troll des Monats, Badge-Sammler)
- [x] User-Profile mit Badge-Showcase und Glegg-Score-Level-System
- [x] Zufall/Roulette mit Slot-Machine-Animation
- [x] Änderungsprotokoll (Wikipedia-Style)

#### Troll-Features & Easter Eggs
- [x] Konami-Code → 10s Chaos-Modus
- [x] Glegg-Translator (deutsche Texte in Gleggmire-Sprache)
- [x] Lösch-Petitionen (Konfetti, aber Eintrag bleibt)
- [x] Visit-Counter ab 69.420 (Retro-Style)
- [x] Breaking News (rotes Marquee, kommt nach Schließen zurück)
- [x] Uhrzeit-Events (4:20-Banner, Nacht-Modus mit Eule)
- [x] Fake-Melden-Button ("Von Gleggmire persönlich abgelehnt")
- [x] Fake-Übersetzen-Button (absurde Englisch-Übersetzungen)
- [x] Dekorative Titelleisten-Buttons (Schließen/Minimieren/Maximieren)

#### Auth & API
- [x] Discord OAuth (Login/Logout/Callback via Supabase)
- [x] Auth-Button mit Avatar-Dropdown
- [x] Middleware für Session-Refresh
- [x] Public API v1: GET /terms, /terms/[slug], /terms/random
- [x] oEmbed-Proxy mit 1h Cache

#### Admin & Moderation
- [x] Admin-Dashboard mit Stats
- [x] Moderations-Queue (Freischalten/Ablehnen)
- [x] Nutzerverwaltung (Ban mit 3-Stufen-Bestätigung)
- [x] Moderations-Log (unveränderlich)
- [x] Breaking-News-Formular (doppelte Bestätigung)

#### Design & Layout (Redesign v2)
- [x] Clean/Modern Design inspiriert von Notion/Linear
- [x] Dark/Light Mode mit CSS Custom Properties
- [x] Sketch-Akzente: handgezeichnete Pfeile, Unterstreichungen, Kreise, Divider
- [x] Fonts: Space Grotesk (Headings) + Inter (Body)
- [x] Farben: Off-White #FAFAF9, Off-Dark #0F0F0F, Accent #E8593C
- [x] Theme-Toggle mit Sun/Moon-Icons
- [x] Sticky Header mit Backdrop-Blur
- [x] Responsive Mobile Navigation
- [x] Impressum, Datenschutz, About

#### Datenbank
- [x] Vollständiges Schema (22 Tabellen, Migration SQL)
- [x] Seed-Daten: ~79 Begriffe aus Gleggmire-Videos
- [x] System-User für Starter-Daten

### Nächste Phase (für Produktions-Launch)
- [x] Supabase-Projekt erstellt (EU-Region Frankfurt)
- [ ] Mock-Daten durch echte Supabase-Queries ersetzen
- [x] Discord OAuth App erstellt und konfiguriert
- [ ] Upstash Redis einrichten (Rate Limiting)
- [ ] Bild-Upload zu Supabase Storage
- [ ] react-player für echte Video-Embeds
- [ ] Tenor/Giphy API für GIF-Suche
- [ ] Deployment auf Vercel/Railway
- [ ] Domain gleggmire.net konfigurieren
- [ ] Cloudflare Email Routing verifizieren
- [ ] DSGVO: IP-Log Cron-Job (90-Tage-Löschung)
- [ ] Performance-Optimierung (ISR, Caching)

### Benötigte Credentials für Launch
| Service | Was wird benötigt |
|---------|------------------|
| Supabase | Projekt-URL + Anon Key + Service Role Key |
| Discord | OAuth App: Client ID + Secret |
| Upstash Redis | REST URL + Token |
| Tenor/Giphy | API Key (für GIF-Suche) |
| YouTube | Data API Key (optional) |
| Twitch | Client ID + Secret (optional) |

### Architektur-Notizen
- Alle Seiten funktionieren mit Mock-Daten — DB-Swap ist vorbereitet
- Admin-Erkennung: Discord-ID `303835609762627586` hardcoded
- YouTube Embeds: immer youtube-nocookie.com
- IP-Log: Separate Tabelle, nie öffentlich, 90 Tage Auto-Delete
- Spezifikation erwähnt Railway UND Vercel — beides kompatibel
