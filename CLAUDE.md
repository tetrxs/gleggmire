# gleggmire.net — Entwicklungs-Guide

## Projektbeschreibung
Fan-Community-Plattform für den YouTuber Gleggmire. Glossar (Urban Dictionary-Style), Clip-Archiv, Community-Features. Windows XP Troll-Ästhetik.

## Tech Stack
- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS (custom XP-Theme)
- **Backend:** Supabase (PostgreSQL, Auth, Storage) — EU-Region!
- **State:** Zustand
- **Rate Limiting:** Upstash Redis
- **Fuzzy Search:** fuse.js
- **Video:** react-player

## Konventionen
- Sprache im Code: Englisch (Variablen, Funktionen, Kommentare)
- UI-Texte: Deutsch
- Commits: Deutsch, logisch zusammenhängend
- Keine Emojis im Code

## Wichtige Regeln
- DSGVO: Supabase EU-Region, IP-Logs 90 Tage auto-delete, youtube-nocookie.com
- Dark Mode verfuegbar (ThemeToggle im Header)
- Admin-Erkennung: Nur über Discord-ID-Whitelist im Backend-Code
- Standard-Admin Discord ID: `303835609762627586`
- YouTube Embeds: Immer `youtube-nocookie.com`
- IP-Adressen: Separate `comment_ip_log` Tabelle, nie öffentlich

## Projektstruktur
```
src/
  app/                  # Next.js App Router
    (routes)/           # Seiten-Routen
    api/                # API Routes
  components/
    ui/                 # Basis-UI (XP-Fenster, Buttons, etc.)
    layout/             # Header, Footer, Navigation
    glossary/           # Glossar-Komponenten
    clips/              # Clip-Komponenten
    comments/           # Kommentar-System
  lib/
    supabase/           # Supabase Client & Queries
    utils/              # Hilfsfunktionen
    constants/          # Konstanten (Admin-IDs, Farben, etc.)
  stores/               # Zustand Stores
  types/                # TypeScript Types
```

## Dev Commands
```bash
npm run dev          # Entwicklungsserver
npm run build        # Produktions-Build
npm run lint         # Linting
```
