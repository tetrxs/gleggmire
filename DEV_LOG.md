# Entwicklungsprotokoll — gleggmire.net

## Status: Phase 3 — Clip-Archiv, Kommentare, Community

### Commits
1. `8cd9ff4` — Initiales Setup: Next.js 16, Tailwind v4, XP Design-System, Layout, DB-Schema
2. `628c7af` — Glossar-System: Liste, Detail, Einreichen, Zufall, Änderungen, Seed-Daten

### Erledigte Features
- [x] Next.js 16 + TypeScript + Tailwind CSS v4 Setup
- [x] Windows XP Design-System (XpWindow, XpButton, XpDialog, Farben, Fonts)
- [x] Layout: Header (XP-Toolbar), Footer (3-Spalten), Mobile Navigation
- [x] Statische Seiten: Impressum, Datenschutz, About
- [x] Supabase Client/Server Helpers + vollständiges DB-Schema (22 Tabellen)
- [x] Glossar-Liste mit Suche, Filterung (A-Z, Tags, Datum)
- [x] Glossar-Detail mit Definitionen, Voting, Cope-O-Meter, Ratio'd-Banner
- [x] Troll-Buttons: Bestreiten, Melden (funktionslos), Fake-Übersetzung
- [x] Begriff einreichen mit Live-Fuzzy-Matching (3-Stufen), Auto-Draft-Save
- [x] Zufall-Seite mit Slot-Machine-Animation (Glegg-Roulette)
- [x] Änderungsprotokoll (Wikipedia-Style)
- [x] Seed SQL mit ~79 Starter-Begriffen
- [x] Zustand Stores (Audio Mute, Background)
- [x] Fuzzy Matching (Normalisierung + Levenshtein)
- [x] TypeScript Types, Constants (Badges, Reaktionen, Anonyme Namen)

### In Arbeit (Subagents)
- [ ] Clip-Archiv (Seite, Cards, Player)
- [ ] Kommentar-System (Editor, Attachments, Reaktionen, Mute-Toggle)
- [ ] Leaderboard & Community (Rangliste, Profile, Badges, Glegg-Score)

### Nächste Schritte
- [ ] Discord OAuth Authentifizierung
- [ ] Troll-Features & Easter Eggs (Konami-Code, Dekorative Titelleisten-Buttons, Uhrzeit-Events)
- [ ] Admin & Moderation Panel
- [ ] API Routes (oembed, terms, votes)
- [ ] Supabase Integration (echte Daten statt Mock)

### Offene Fragen / Benötigte Credentials
- Supabase Projekt-URL und Keys (muss vom Betreiber erstellt werden)
- Upstash Redis Credentials
- Discord OAuth App Credentials (Client ID + Secret)
- Tenor/Giphy API Key für GIF-Suche
- YouTube Data API Key (optional, für Video-Metadaten)

### Architektur-Notizen
- Alle Seiten funktionieren aktuell mit Mock-Daten — DB-Swap ist vorbereitet
- Build kompiliert sauber mit 10 Routen
- Kein Dark Mode (by design)
- Admin-Erkennung: Nur über Discord-ID-Whitelist im Backend
- Spezifikation erwähnt Railway UND Vercel — beides kompatibel
