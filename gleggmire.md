# gleggmire.net — Vollständiges Konzept & Spezifikation

> **Inoffizielles Fan-Projekt** der Gleggmire-Community.
> Kein Code — reine Konzept- und Anforderungsdokumentation für die Entwicklung.

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Impressum, Datenschutz & rechtliche Hinweise](#2-impressum-datenschutz--rechtliche-hinweise)
3. [Design-System: Windows XP Troll-Ästhetik](#3-design-system-windows-xp-troll-ästhetik)
4. [Seitenarchitektur & Navigation](#4-seitenarchitektur--navigation)
5. [Glossar-Einträge](#5-glossar-einträge)
6. [Smart-Erkennung beim Begriff-Einreichen (Fuzzy Matching)](#6-smart-erkennung-beim-begriff-einreichen-fuzzy-matching)
7. [Kommentar-System mit Medien-Anhang](#7-kommentar-system-mit-medien-anhang)
8. [Autoplay & Globaler Mute-Toggle](#8-autoplay--globaler-mute-toggle)
9. [Clip-Archiv](#9-clip-archiv)
10. [Admin- & Moderator-Rechteverwaltung](#10-admin---moderator-rechteverwaltung)
11. [Community-Features](#11-community-features)
12. [Troll-Features](#12-troll-features)
13. [Easter Eggs & Meta-Features](#13-easter-eggs--meta-features)
14. [Tech-Stack Empfehlung](#14-tech-stack-empfehlung)
15. [Datenbank-Schema](#15-datenbank-schema)
16. [Starter-Datensatz: Das Glexicon](#16-starter-datensatz-das-glexicon)

---

## 1. Projektübersicht

**gleggmire.net** ist eine interaktive Fan-Community-Plattform rund um den YouTuber **Gleggmire**, der in seinen GTA RP Trolling-Videos eine eigene Sprache und Begriffswelt entwickelt hat. Die Seite dient als kollektiv gepflegtes Glossar dieser Begriffe — eine Art Urban Dictionary, aber speziell für die Gleggmire-Community.

### Kernziel

Die Community soll Begriffe sammeln, definieren, mit Clips belegen und kommentieren können. Dabei soll die Plattform den trolligen, chaotischen Charakter der Community widerspiegeln — sowohl im Design als auch in den Features.

### Philosophie

- Spaß und Chaos stehen über Perfektion
- Community-getrieben: Nutzer erstellen und moderieren Inhalte selbst
- Referenz & Archiv: Nichts geht verloren, alles wird dokumentiert
- Direkte Verbindung zwischen Website und YouTube-Inhalten durch Clip-Verlinkung

---

## 2. Impressum, Datenschutz & rechtliche Hinweise

---

### 2.1 Impressum (§5 TMG)

Das Impressum muss auf einer eigenen Seite `/impressum` erreichbar sein und vom Footer jeder Seite verlinkt werden. Es muss folgenden Pflichtinhalt enthalten:

**Angaben gemäß §5 TMG:**

```
Hans Vincent Trommer
c/o MDC Management#57
Welserstraße 3
87463 Dietmannsried
Deutschland

Kontakt:
E-Mail: kontakt@gleggmire.net
Discord: tetrxs

Hinweis: Dies ist ein privates, nicht-kommerzielles Fan-Projekt.
```

> ℹ️ **Hinweis für den Entwickler:** Die E-Mail-Adresse `kontakt@gleggmire.net` ist via **Cloudflare Email Routing** eingerichtet und leitet eingehende Mails an die private E-Mail des Betreibers weiter. Kein eigener Mailserver erforderlich. Die Adresse ist fix und muss nicht mehr geändert werden.

Die Discord-Adresse `tetrxs` kann **zusätzlich** als informeller Kontaktweg angegeben werden, ersetzt aber nicht die E-Mail-Pflicht.

---

### 2.2 Fan-Disclaimer (Community-seitige Anzeige)

Folgender Hinweis erscheint **an drei Stellen** der Website:

1. **Im Header** als kleiner Link/Badge: „Inoffizielles Fanprojekt"
2. **Im Footer** auf jeder Seite als eigenständiger Abschnitt
3. **Auf der /about-Seite** in ausführlicher Form

**Formulierung (final):**

> Diese Seite ist ein inoffizielles Fan-Projekt der Gleggmire-Community und steht in **keiner Verbindung** zu Gleggmire oder dessen offiziellen Kanälen. Alle Inhalte wurden von der Community erstellt und gepflegt. Das Glossar erhebt keinen Anspruch auf Vollständigkeit oder Richtigkeit.
>
> Bei Problemen, Beschwerden oder Fragen bitte direkt über Discord melden: **tetrxs**

---

### 2.3 Datenschutzerklärung (DSGVO)

Die Website ist deutschsprachig, richtet sich primär an deutsche Nutzer und wird von einer in Deutschland ansässigen Person betrieben — damit gilt die **DSGVO vollumfänglich**, auch wenn der Server in den Niederlanden (Railway) steht. Da die Niederlande EU-Mitglied sind, besteht kein Drittlandtransfer-Problem.

Die Datenschutzerklärung muss auf einer eigenen Seite `/datenschutz` erreichbar sein und vom Footer jeder Seite verlinkt werden.

#### Verantwortlicher (Art. 13 DSGVO)

```
Hans Vincent Trommer
c/o MDC Management#57
Welserstraße 3
87463 Dietmannsried
E-Mail: kontakt@gleggmire.net
```

#### Hosting & Infrastruktur

| Dienst | Zweck | Standort | Rechtsgrundlage |
|--------|-------|----------|----------------|
| **Railway** | Hosting des Next.js-Frontends und der API | Niederlande (EU) | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) |
| **Supabase** | Datenbank, Authentifizierung, Datei-Storage | EU-Region (wählbar) | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) |
| **Upstash Redis** | Rate-Limiting | EU-Region | Art. 6 Abs. 1 lit. f DSGVO |

> ⚠️ **Hinweis für den Entwickler:** Bei Supabase im Setup explizit eine EU-Region wählen (z.B. `eu-central-1` / Frankfurt). Das muss dokumentiert sein.

#### Verarbeitete Daten beim Login (Discord OAuth)

Wenn sich ein Nutzer über Discord anmeldet, erhält die Website folgende Daten von Discord:

- Discord User ID
- Discord-Username (Anzeigename)
- Discord-Avatar-URL (falls vorhanden)
- E-Mail-Adresse (wird von Discord übermittelt, aber **nicht auf gleggmire.net gespeichert** — nur die User ID und der Anzeigename werden in der Datenbank gesichert)

Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung / Nutzung des Dienstes). Die Datenschutzerklärung von Discord gilt zusätzlich für den OAuth-Prozess selbst.

#### IP-Adressen & Logging

**Anonyme Kommentare:** Auch wenn ein Kommentar unter dem Pseudonym „Anonymer Schleimbeutel" veröffentlicht wird, wird die IP-Adresse des Verfassers **serverseitig gespeichert und protokolliert**. Diese Information ist ausschließlich für Admins im Moderations-Backend einsehbar und dient der Strafverfolgung bei rechtswidrigen Inhalten.

Speicherdauer der IP-Adressen: **90 Tage**, danach automatische Löschung.

Dies muss in der Datenschutzerklärung transparent kommuniziert werden — der „Anonym"-Modus bedeutet anonyme Darstellung gegenüber anderen Nutzern, **nicht** technische Anonymität gegenüber dem Betreiber.

Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Rechtsdurchsetzung).

> ⚠️ **Hinweis für den Entwickler:** Die IP-Adresse muss bei jedem Kommentar-Submit serverseitig in einem separaten Log-Eintrag gespeichert werden (nicht im `comments`-Datensatz selbst, sondern in einer eigenen `comment_ip_log`-Tabelle mit Fremdschlüssel auf `comment_id`). Dieses Log ist nie über die öffentliche API abrufbar, nur über das Admin-Panel.

#### YouTube & Twitch Embeds (Drittanbieter-Inhalte)

Wenn eingebettete YouTube-Videos oder Twitch-Clips in der Kommentarsektion geladen werden, stellen diese **Verbindungen zu Servern von Google LLC (YouTube) bzw. Twitch Interactive Inc.** her. Dabei können personenbezogene Daten (insbesondere IP-Adresse, Browser-Informationen) an diese Unternehmen übertragen werden — auch wenn der Nutzer nicht auf YouTube oder Twitch eingeloggt ist.

**Technische Umsetzung (Privacy-Enhancement):**
- YouTube-Embeds verwenden die datenschutzfreundlichere Domain `youtube-nocookie.com` statt `youtube.com`
- Videos laden **nicht automatisch beim Seitenaufruf** (Autoplay nur bei Sichtbarkeit im Viewport) — der initiale iFrame-Aufruf erfolgt erst wenn das Video in den Viewport scrollt, nicht beim Laden der Seite
- Ein Cookie-Hinweis vor dem ersten Video-Aufruf ist **nicht zwingend erforderlich** wenn `youtube-nocookie.com` verwendet wird, wird aber empfohlen

> ⚠️ **Hinweis für den Entwickler:** YouTube-iFrames immer mit `src="https://www.youtube-nocookie.com/embed/..."` einbinden, nie mit `youtube.com`. Twitch hat keine entsprechende Privacy-Alternative — in der Datenschutzerklärung explizit auf Twitch-Tracking hinweisen.

#### Cookies & LocalStorage

Die Website setzt keine Tracking-Cookies. Folgende technisch notwendige Speicherungen finden statt:

| Speicherort | Inhalt | Zweck | Löschung |
|------------|--------|-------|---------|
| `localStorage` | Globaler Mute-Status (true/false) | Speichert ob Videos stumm oder laut sind | Beim manuellen Browser-Löschen |
| `localStorage` | Desktop-Hintergrund-Auswahl | Persistiert die gewählte Hintergrundoption | Beim manuellen Browser-Löschen |
| `localStorage` | Halbfertiger Einreichungs-Entwurf | Wird 24h aufbewahrt wenn Nutzer zur Bestehende-Begriff-Seite wechselt | Automatisch nach 24h |
| Session-Cookie | Auth-Token (Supabase) | Hält die Login-Session aufrecht | Bei Logout oder Ablauf |

Da ausschließlich technisch notwendige Speicherungen ohne Tracking-Zweck stattfinden, ist ein Cookie-Banner nach aktueller Rechtslage **nicht zwingend erforderlich**. Ein einfacher Hinweis in der Datenschutzerklärung genügt.

#### Nutzerdaten & Löschung

Nutzer haben das Recht auf Auskunft, Berichtigung und Löschung ihrer Daten (Art. 15–17 DSGVO). Ein Lösch-Antrag kann per E-Mail oder Discord (`tetrxs`) gestellt werden. Folgende Daten werden bei Löschung eines Accounts entfernt:

- Discord User ID und Anzeigename
- Avatar-URL
- Glegg-Score und Badge-Daten

Folgendes verbleibt aus inhaltlichen Gründen **anonym erhalten** (Inhalte werden nicht gelöscht, nur de-personalisiert):

- Glossar-Einträge (Autor wird auf „[gelöschter Nutzer]" geändert)
- Kommentare (Autor wird auf „[gelöschter Nutzer]" geändert)
- IP-Log-Einträge (bleiben für die verbleibende Aufbewahrungsdauer erhalten, werden danach automatisch gelöscht)

#### Speicherdauer im Überblick

| Datenkategorie | Speicherdauer |
|----------------|--------------|
| Account-Daten (Discord ID, Username) | Bis zur Account-Löschung |
| IP-Adressen (Kommentar-Log) | 90 Tage, dann automatische Löschung |
| Auth-Session-Tokens | 7 Tage oder bis Logout |
| Einreichungs-Entwürfe (localStorage) | 24 Stunden |

---

### 2.4 Footer-Struktur

Der Footer besteht aus drei Spalten und einem unteren Streifen:

- **Linke Spalte:** Logo + Tagline + 2-Satz-Fan-Disclaimer
- **Mittlere Spalte:** Navigation (Glossar · Clips · Einreichen · Leaderboard · Zufall · About)
- **Rechte Spalte:** Discord-Kontakt-Badge `tetrxs` + Link zum YouTube-Kanal von Gleggmire (externer Link)
- **Unterster Streifen:** `© {aktuelles Jahr} gleggmire.net — Inoffizielles Fan-Projekt. Nicht mit Gleggmire affiliiert.` + Links zu Impressum · Datenschutz

---

## 3. Design-System: Windows XP Troll-Ästhetik

Das Design der Website soll bewusst retro und trollig wirken, angelehnt an die ikonische **Windows XP-Optik** der frühen 2000er. Das ist kein Fehler, sondern gewollt — es passt zur Community-Kultur und hebt die Seite von modernen, sterilen Web-Apps ab.

### Allgemeine Ästhetik

Die Seite soll aussehen wie eine Mischung aus einem alten Windows XP-Desktop und einem frühen Internet-Forum (ca. 2003–2008). Elemente wie Titelleisten mit Farbverlauf, erhabene Buttons mit 3D-Effekt, gepunktete Rahmen und grelle Systemfarben sind ausdrücklich erwünscht.

### Farbpalette

| Farbe | Verwendung | Hex-Wert |
|-------|-----------|---------|
| **XP-Blau** (Titelleisten-Verlauf) | Primäre Header, aktive Fenster-Titelleisten | von `#1F4ECC` zu `#3A92D8` (Verlauf) |
| **XP-Grün** (Start-Button) | Primäre CTAs, Abschicken-Buttons | `#3A9E3A` (dunkleres Gras-Grün) |
| **XP-Silber/Luna** | Hintergrund-Panels, inaktive Fenster | `#D4D0C8` |
| **Glegg-Orange** | Akzente, Upvote-Buttons, Hover-States | `#E8593C` |
| **XP-Fehler-Rot** | Downvotes, Ratio'd, Fehlermeldungen | `#CC0000` |
| **Desktop-Hintergrund** | Seitenhintergrund (optional) | XP-Bliss-Grün-Blau oder eine Gleggmire-Version davon |
| **Textfarbe** | Body-Text | `#000000` (schwarz, klassisch) |

### Fenster-Rahmen (das Kernelement)

Inhalts-Karten, Glossar-Einträge, Kommentar-Boxen und Panels sollen wie **Windows XP-Fenster** aussehen:

- **Titelleiste:** Farbverlauf von XP-Blau zu hellblau, weiße Schrift, leicht erhabene „Schließen"-, „Minimieren"- und „Maximieren"-Buttons (rot/gelb/grün) — rein dekorativ, klicken bewirkt lustige Dinge (siehe Troll-Features)
- **Fensterkörper:** Leicht grauer Hintergrund (`#ECE9D8` — klassische XP Luna-Farbe), dünner erhabener Rahmen (raised border-Effekt via CSS `border: 2px solid; border-color: #FFFFFF #808080 #808080 #FFFFFF` bzw. die 3D-Border-Technik)
- **Innere Panels:** Eingesenkte Boxen (`inset`-Effekt) für Textfelder, Kommentar-Bereiche und Listen

### Buttons

- **Primär-Button (z.B. Abschicken):** Erhabener 3D-Effekt wie XP-Standard-Buttons, helles Grau mit dunklerer Border-Unterseite, hover-State verändert die Tiefe
- **Start-Button-Style:** Für besonders wichtige Aktionen (z.B. „Begriff einreichen") darf ein grüner Startbutton-Stil verwendet werden
- **Gedrückter Zustand:** Buttons erscheinen eingedrückt (inset) beim Klick

### Typografie

- **Primärschrift:** `Tahoma` oder `MS Sans Serif` — die originalen Windows XP Systemschriften. Als Web-Fallback: `Tahoma, Verdana, sans-serif`
- **Monospace:** `Courier New` für Timecodes, Code-Snippets, Metadaten
- **Schriftgrößen:** Klassisch klein — 11px für Labels, 13px für Body-Text, 16px für Überschriften. XP war nie ein großer Freund von großer Schrift.

### Icons & Grafiken

- Wo immer sinnvoll: **Pixel-Art-Icons** im 16x16 oder 32x32 Stil, wie sie in Windows XP verwendet wurden
- **Ordner-Icons** für Kategorien, **Disketten-Icon** für Speichern, **Lupe** für Suche — aber mit Gleggmire-Twist (z.B. ein GTA-Polizei-Auto statt Ordner)
- Der **Fehler-Dialog** (rotes X in weißem Kreis) taucht bei Validierungsfehlern auf — mit klassischem „OK"-Button

### Titelleisten-Texte (Flavour)

Jede Inhalts-Karte hat einen eigenen Titelleisten-Text der zum Inhalt passt. Beispiele:
- Glossar-Eintrag: `📖 Gleggmire-Enzyklopädie — [Begriffname].exe`
- Kommentar-Sektion: `💬 Community-Stimmung — Nicht abstürzen`
- Upvote-Bereich: `✅ Gleggmire-Approved-o-Meter 3000`
- Fehlermeldung: `⚠️ Kritischer Troll-Fehler — Bitte nicht weinen`

### Systemton-Referenzen (optional, mit Nutzer-Erlaubnis)

Wenn Nutzer explizit Töne aktivieren (separate Einstellung, opt-in!), können klassische Windows-Systemtöne bei bestimmten Aktionen abgespielt werden:
- Kommentar abschicken → Windows XP „Ding"
- Ratio'd → Windows XP „Kritischer Stopp"-Sound
- Neuer Eintrag freigeschaltet → Windows XP „Programm wurde geöffnet"-Sound
- Fehler → klassisches „Bonk"-Geräusch

### Cursor

Optional: Ein benutzerdefinierter Cursor im Windows-XP-Stil. Auf Hover-States bei Buttons ein „Hand"-Cursor wie der klassische blaue Windows-Zeigefinger.

### Dark Mode

Es gibt **keinen Dark Mode** — das wäre anti-authentisch für eine Windows-XP-Ästhetik. Die Seite existiert nur im hellen, grell-silbernen Luna-Look. Das ist Feature, kein Bug.

### Hintergrundoptionen

Der Seiten-Hintergrund (außerhalb der „Fenster") kann eines von mehreren Motiven sein, zwischen denen Nutzer wählen können (gespeichert in localStorage):
- **Gleggmire Bliss:** Die ikonische XP-Hügellandschaft, aber mit Gleggmire-Charakter drauf
- **GTA San Andreas Himmel:** Blauer Verlauf im SA-Stil
- **Tiled Pattern:** Klassisches gepunktetes oder kariertes XP-Desktop-Muster
- **Standard:** Einfaches XP-Teal/Blau (`#3A6EA5`)

---

## 4. Seitenarchitektur & Navigation

### Seiten-Übersicht

| URL | Beschreibung |
|-----|-------------|
| `/` | Startseite: Featured Begriff des Tages, aktuelle Top-Clips, Aktivitäts-Feed |
| `/glossar` | Vollständige Glossarliste mit Suche, Filterung (A-Z, Kategorien, Datum) |
| `/glossar/[slug]` | Detail-Seite eines Begriffs: Definition, Clips, Kommentare, Abstimmungen, Änderungsverlauf |
| `/clips` | Clip-Archiv: Thumbnail-Grid aller verlinkten Videos, filterbar nach Begriff/Hot/New/Top |
| `/einreichen` | Formular zum Einreichen neuer Begriffe (mit Moderations-Queue) |
| `/leaderboard` | Contributor-Rangliste nach Glegg-Score, Badges, Troll des Monats |
| `/zufall` | Zufälligen Begriff anzeigen + „Glegg-Roulette"-Button |
| `/about` | Über das Projekt, ausführlicher Disclaimer, Kontakt |
| `/aenderungen` | Öffentliches Änderungsprotokoll aller Bearbeitungen (Wikipedia-Style) |

### Navigation

**Desktop (Topbar):**
- Links: gleggmire.net Logo + „Inoffizielles Fanprojekt"-Badge
- Mitte: Suchfeld (globale Suche über alle Begriffe und Clips)
- Rechts: Login (Discord OAuth) · Dark-Mode-Toggle existiert **nicht** (by design) · Zufalls-Button

**Mobile:**
- Hamburger-Menü für die Navigation
- Sticky Bottom-Navigation mit 4 Icons: Glossar · Clips · Einreichen · Profil

---

## 5. Glossar-Einträge

### Eintrag-Struktur

Jeder Glossar-Eintrag besteht aus folgenden Bestandteilen:

**Pflichtfelder (beim Einreichen):**
- **Begriff:** Das Wort oder die Phrase (z.B. „Gegläggmirt")
- **Definition:** Erklärung des Begriffs im GTA RP / Gleggmire-Kontext
- **Beispielsatz:** Mindestens ein Beispiel wie der Begriff verwendet wird
- **Kategorie-Tag:** Mindestens ein Tag (z.B. GTA RP, Trolling, Reaktionen, Cops, Meta, Lore)

**Optionale Felder:**
- **Phonetik (IPA):** Aussprache-Hilfe, z.B. `/gɛˈglɛgmɪʁt/`
- **Wortart:** Verb, Substantiv, Ausruf etc.
- **Herkunft/Kontext:** In welchem Video oder Kontext taucht der Begriff erstmals auf
- **Alternative Definitionen:** Bis zu 3 verschiedene Community-Definitionen (wie Urban Dictionary), die Community kann abstimmen welche am besten ist

**Automatisch generierte Felder:**
- Hinzugefügt von (Username)
- Datum der Erstellung
- Letztes Bearbeitungsdatum
- Änderungsverlauf
- Verknüpfte Clips (automatisch aus dem Clip-Archiv)
- Upvote/Downvote-Zähler
- Cope-O-Meter-Wert (Community-voted)

### Cope-O-Meter

Das Cope-O-Meter ist ein Community-Voting-Feature das angibt, wie viel „Cope" (Verdrängung, Schmerz, Akzeptanz von Niederlage) in einem Begriff steckt. Es wird auf einer Skala von 0–100% angezeigt als farbiger Fortschrittsbalken:
- 0–30%: Grün (wenig Cope, purer W)
- 31–70%: Gelb/Orange (mittlerer Cope)
- 71–100%: Rot (maximaler Cope, totales L)

Nutzer stimmen einmalig pro Eintrag ab. Der Wert wird als Durchschnitt aller Stimmen berechnet.

### Abstimmungs-System

Die Upvote/Downvote-Buttons tragen Gleggmire-spezifische Bezeichnungen:
- **Upvote:** „▲ Gleggmire-approved"
- **Downvote:** „▼ Cope & Seethe"

Beide Zähler sind sichtbar. Das Verhältnis von Down- zu Upvotes ist die Grundlage für die Ratio-Mechanik (siehe Troll-Features).

### Moderations-Queue

Neu eingereichte Begriffe erscheinen **nicht sofort** im Glossar. Sie landen in einer öffentlich sichtbaren Queue unter `/einreichen/queue`:
- **10 Community-Upvotes** schalten einen Eintrag automatisch frei
- **10 Community-Downvotes** ohne Upvotes schicken ihn zurück zur Überarbeitung
- Moderatoren (Nutzer mit „Lore-Wächter"-Badge) können Einträge direkt freischalten oder ablehnen

### Bestreitungs-System

Jeder Eintrag hat einen „⚠️ Bestreiten"-Button. Wird er geklickt, erscheint ein rotes `[BESTRITTEN]`-Banner am Eintrag und eine Community-Abstimmung startet:
- Läuft 7 Tage
- Bei Mehrheitsmeinung „bestritten": Der Eintrag bekommt dauerhaft das Banner bis er überarbeitet wird
- Der ursprüngliche Autor wird per Discord-Benachrichtigung informiert (wenn verknüpft)

### Änderungsverlauf (Wikipedia-Style)

Jede Bearbeitung eines Eintrags wird protokolliert mit:
- Timestamp
- Username des Bearbeiters
- Was wurde geändert (Diff)
- Optionale Begründung (Pflichtfeld beim Bearbeiten, wird zu einem Pflicht-Komik-Feld: „Begründung" mit Placeholder „z.B. Weil ich es kann")

---

## 6. Smart-Erkennung beim Begriff-Einreichen (Fuzzy Matching)

### Problem & Ziel

Die Community wird Begriffe mit allen erdenklichen Schreibweisen einreichen — Großbuchstaben, Kleinbuchstaben, Leerzeichen, Bindestriche, Umlaute als ae/oe/ue, Tippfehler und kreative Kombinationen. Ohne eine intelligente Erkennungslogik entstehen schnell Dutzende Duplikate desselben Begriffs, z.B. `Kanackentasche`, `kanackentasche`, `Kanaken Tasche`, `Kanacken Tasche`, `kanackntasche`. Das Ziel ist, dem Nutzer beim Einreichen proaktiv auf mögliche Übereinstimmungen hinzuweisen, **bevor** er auf „Abschicken" klickt.

### Wann wird gesucht?

Die Suche wird live ausgelöst während der Nutzer tippt, mit einem kurzen Debounce von ca. 400ms (nicht bei jedem Tastendruck, sondern nach einer kurzen Tippause). Ab einer Mindestlänge von 3 Zeichen beginnt die Suche.

### Normalisierungsregeln (was vor dem Vergleich bereinigt wird)

Bevor der eingegebene Begriff mit bestehenden Einträgen verglichen wird, durchläuft er eine Normalisierungspipeline. Diese Regeln gelten für die Vergleichsebene — die echte Schreibweise des gespeicherten Begriffs bleibt immer erhalten:

| Regel | Beispiel |
|-------|---------|
| Alles zu Kleinbuchstaben | `Kanackentasche` → `kanackentasche` |
| Umlaute vereinheitlichen | `ü → ue`, `ö → oe`, `ä → ae`, `ß → ss` (beide Varianten werden akzeptiert) |
| Mehrfache Leerzeichen entfernen | `Kühles  Blondes` → `kühles blondes` |
| Bindestriche = Leerzeichen | `Lungen-Torpedo` = `Lungen Torpedo` |
| Führende & nachfolgende Leerzeichen entfernen | `  snench ` → `snench` |
| Sonderzeichen entfernen | `Fick-Toast!` → `fick toast` |

### Matching-Stufen (in dieser Priorität)

Die Erkennung läuft in drei Stufen mit absteigender Treffsicherheit:

**Stufe 1 — Exakter Treffer (nach Normalisierung)**
Der normalisierte Eingabetext stimmt 1:1 mit einem normalisierten bestehenden Eintrag überein. Das ist ein sicherer Duplikat-Treffer. Beispiel: `kanackentasche` = `Kanackentasche`.

**Stufe 2 — Fuzzy-Ähnlichkeit (Levenshtein-Distanz)**
Die Levenshtein-Distanz zwischen dem normalisierten Eingabetext und bestehenden normalisierten Einträgen wird berechnet. Ein Treffer wird angezeigt wenn die Distanz ≤ 2 Zeichen ist (d.h. maximal 2 Buchstaben unterschiedlich, getauscht oder fehlend). Beispiel: `kanackntasche` ↔ `kanackentasche` (Distanz: 1).

**Stufe 3 — Teilstring / Enthält-Suche**
Wenn der eingegebene Begriff als Teilstring in einem bestehenden Eintrag enthalten ist, oder umgekehrt, wird ein Vorschlag angezeigt. Beispiel: `steif` schlägt `Steifen RP` vor. Beispiel: `Lungen` schlägt `Lungen-Torpedo` vor.

### UI-Verhalten: Was sieht der Nutzer?

**Kein Treffer gefunden:** Nichts passiert. Das Formular bleibt unverändert. Nutzer kann normal weiter ausfüllen und einreichen.

**Mögliche Übereinstimmung gefunden (Stufe 2 oder 3):** Unterhalb des Begriff-Eingabefeldes erscheint ein gelbes Hinweis-Banner im Windows-XP-Warnungs-Stil (gelbes Ausrufezeichen-Icon, erhabener XP-Dialog-Rahmen) mit dem Text:

> ⚠️ Ähnlicher Begriff gefunden: **„Kanackentasche"**
> Meintest du das? → [Zum Eintrag wechseln] [Trotzdem neu einreichen]

**Exakter Treffer gefunden (Stufe 1):** Rotes XP-Fehler-Banner:

> ✖ Dieser Begriff existiert bereits: **„Kanackentasche"**
> → [Zum Eintrag wechseln] [Definition vorschlagen] [Abbrechen]

### Die zwei Aktionsmöglichkeiten bei einem Treffer

**„Zum Eintrag wechseln":**
Der Nutzer wird direkt auf die bestehende Begriff-Detailseite weitergeleitet. Dort kann er eine alternative Definition einreichen, kommentieren oder abstimmen. Der halbfertige Einreichungs-Entwurf wird für 24 Stunden in `localStorage` gespeichert, sodass der Nutzer zurücknavigieren und weitermachen kann.

**„Trotzdem neu einreichen":**
Nur sichtbar bei Stufe-2- und Stufe-3-Treffern (nicht bei exaktem Duplikat). Der Nutzer bestätigt damit explizit, dass es sich um einen anderen Begriff handelt. Ein Pflichtfeld erscheint: „Warum ist das kein Duplikat?" (min. 10 Zeichen). Das hilft Moderatoren bei der Prüfung.

### Mehrere Treffer gleichzeitig

Wenn die Suche 2–4 ähnliche Einträge findet, werden alle angezeigt als kleine Karten:

> ⚠️ Ähnliche Begriffe gefunden:
> - **„Lungen-Torpedo"** — 4 Definitionen
> - **„Kräuterlunte"** — 2 Definitionen
>
> [Alle anzeigen] [Trotzdem neu einreichen]

Bei mehr als 4 Treffern wird nur „Es gibt bereits X ähnliche Begriffe — [Alle anzeigen]" angezeigt ohne die einzelnen Karten aufzulisten.

### Technische Umsetzung

- Die Normalisierung läuft clientseitig in JavaScript (kein Server-Request nötig)
- Der Fuzzy-Vergleich (Levenshtein) läuft ebenfalls clientseitig gegen eine gecachte Liste aller normalisierten Begriffe und ihrer IDs, die beim ersten Seitenaufruf einmalig geladen wird (klein genug als JSON, auch bei tausenden Einträgen)
- Empfohlene Library: `fuse.js` — leichtgewichtig, keine Dependencies, unterstützt Schwellenwert-basiertes Fuzzy-Matching
- Die gecachte Begriffsliste wird serverseitig stündlich invalidiert wenn neue Einträge freigeschaltet werden

### Alias-System (ergänzend)

Jeder Glossar-Eintrag kann zusätzliche **Aliases** haben — alternative Schreibweisen oder Synonyme die auf denselben Eintrag verweisen. Diese Aliases werden ebenfalls in den Fuzzy-Matching-Pool aufgenommen. Beispiele:
- `Lungen-Torpedo` hat Alias `Kräuterlunte`
- `Goi` hat Alias `Gy`
- `Schleim` hat Alias `Verschleimt`
- `Eigene Meimung` hat Alias `Meimung`

Aliases können von Moderatoren und dem Eintrag-Ersteller gesetzt werden. Sie erscheinen auch auf der Eintrag-Detailseite als „Auch bekannt als: ..."

---

## 7. Kommentar-System mit Medien-Anhang

### Grundprinzip

Jeder Kommentar besteht aus einem **optionalen Textfeld** und/oder einem **Medien-Anhang**. Beides gleichzeitig ist ausdrücklich erlaubt und erwünscht. Das Kommentar-Textfeld ist nie ein Pflichtfeld, solange ein Medien-Anhang vorhanden ist — und umgekehrt. Der Abschicken-Button bleibt deaktiviert wenn weder Text noch Anhang vorhanden ist.

### Der + Button

Links in der Kommentar-Toolbar befindet sich ein `+`-Button. Dieser öffnet ein kompaktes Dropdown-Menü (kein Modal, kein Vollbild-Overlay) mit vier Optionen:

1. 🖼 **Bild hochladen**
2. GIF **GIF suchen oder hochladen**
3. ▶ **YouTube-Video verlinken**
4. 🟣 **Twitch Clip verlinken**

Es kann nur ein Anhang pro Kommentar hinzugefügt werden (kein Multi-Attach in Version 1).

### Bild-Upload

- Der Standard-Datei-Picker öffnet sich
- Erlaubte Formate: JPG, JPEG, PNG, WEBP
- Maximale Dateigröße: 10 MB
- Serverseitig wird das Bild auf maximal 1920px Breite komprimiert
- Nach dem Upload erscheint sofort eine Thumbnail-Vorschau im Anhang-Bereich

### GIF

- Zwei Tabs: „GIF hochladen" (wie Bild-Upload, max. 20 MB) und „GIF suchen" (Tenor/Giphy-Integration mit Suchfeld)
- GIFs werden nicht konvertiert, direkt eingebettet
- Vorschau erscheint sofort nach Auswahl

### YouTube-Video verlinken — detaillierter Flow

**Schritt 1 — Link-Eingabe:**
Nach der Auswahl von „YouTube" im Dropdown erscheint ein Eingabefeld direkt im Editor (kein separates Fenster). Der Nutzer fügt die YouTube-URL ein.

**Schritt 2 — Validierung:**
Sobald der Nutzer etwas einfügt oder das Feld verlässt, wird die URL clientseitig auf Gültigkeit geprüft (muss eine gültige YouTube-URL sein: `youtube.com/watch?v=...` oder `youtu.be/...`). Bei ungültiger URL erscheint eine Fehlermeldung direkt unter dem Feld. Der Flow schreitet nicht weiter fort.

**Schritt 3 — Metadaten abrufen:**
Bei gültiger URL wird über einen eigenen API-Proxy (Next.js API Route `/api/oembed`) der Videotitel und die Gesamtdauer abgerufen. Kurzer Lade-Spinner sichtbar. Das Eingabefeld verschwindet danach und wird durch die Anhang-Vorschau ersetzt.

**Schritt 4 — Startpunkt via Scrubber:**
Im Anhang-Block erscheint:
- Videotitel
- Ein horizontaler Scrubber (Slider) über die vollständige Länge des Videos
- Aktuelle Startpunkt-Anzeige als `MM:SS` Zeitcode in Glegg-Orange, live aktualisierend
- Zeitanzeige links (0:00) und rechts (Gesamtdauer)

**Scrubber-Interaktion:**
- Klicken und Ziehen setzt den Startpunkt
- Scroll-Wheel auf dem Scrubber springt in ±5-Sekunden-Schritten (fein-Tuning)
- Standard-Startpunkt ist `0:00` wenn der Nutzer den Scrubber nicht anfasst
- Der gewählte Startpunkt wird als Integer (Sekunden) gespeichert, z.B. `start_seconds: 754`

**Entfernen:**
Ein `✕`-Button rechts im Anhang-Block entfernt den gesamten Anhang inkl. gespeichertem Startpunkt.

### Twitch Clip verlinken — detaillierter Flow

Der Flow ist identisch mit YouTube mit folgenden Unterschieden:

- Nur Twitch-Clip-URLs werden akzeptiert (`clips.twitch.tv/...` oder `twitch.tv/.../clip/...`)
- Normale Twitch-Stream-Links werden **abgelehnt** mit dem Hinweis: „Nur Clips werden unterstützt, keine Stream-Links"
- Twitch Clips haben eine fixe Maximaldauer (60–90 Sekunden) — der Scrubber zeigt nur diesen Bereich
- Metadaten werden über die Twitch Clips API abgerufen
- Der Startpunkt wird als `time=MMmSSs` Parameter an die Twitch-Clip-URL gehängt

### Kommentar-Editor: vollständiges Aussehen

Der Editor besteht von oben nach unten aus:

1. **Textarea** (leer, Placeholder: „Was denkst du? Schreib hier… (optional)") — nimmt den oberen Bereich ein
2. **Anhang-Block** (erscheint nur nach + Aktion, zwischen Textarea und Toolbar): Zeigt Vorschau des Anhangs mit Scrubber (bei Video) oder Thumbnail (bei Bild/GIF)
3. **Toolbar** (untere Leiste): `+`-Button links · Kurze Typenliste als Reminder (`Bild · GIF · YouTube · Twitch`) · „Abschicken"-Button rechts

### Kommentar-Darstellung in der Liste

In der Kommentarliste erscheint ein Kommentar wie folgt:

- **Avatar** (Initialen-Kreis) + **Username** + **Zeitstempel** (z.B. „vor 3h")
- **Kommentar-Text** (falls vorhanden)
- **Eingebetteter Clip/Bild** direkt darunter (falls vorhanden)
- **Reaktions-Icons** (Gleggmire-Custom-Reaktionen, siehe Community-Features)
- **Reply-Button** für nestbare Antworten (1 Ebene tief)

---

## 8. Autoplay & Globaler Mute-Toggle

### Grundregel: Alle Videos sind standardmäßig stumm

Der Standardzustand der Website ist **Stumm für alle Videos**. Dieser Default gilt immer für den ersten Besuch und kann nicht durch Konfiguration verändert werden. Es soll niemand einen unerwarteten Lärm-Anfall bekommen.

### Globaler Mute-Toggle

**Position:** Sticky am oberen Rand der Kommentar-Sektion. Er ist immer sichtbar wenn gescrollt wird und Kommentare mit Videos vorhanden sind.

**Optisches Design (XP-Style):**
- Aussehen wie ein Windows-XP-Systray-Element oder eine kleine XP-Toolbar
- Lautsprecher-Icon + Toggle-Schalter + Label
- Wenn stumm: Roter Lautsprecher mit X, Label: „Clips stumm — klicken zum Aktivieren"
- Wenn laut: Grüner Lautsprecher, Label: „Clips laut — klicken zum Stummschalten"

**Verhalten:**
- Ein Klick schaltet **alle** aktuell geladenen und zukünftig geladenen Video-Einbettungen gleichzeitig
- Kein individuelles An/Aus pro Video (bewusste Designentscheidung)
- Der Zustand wird in `localStorage` gespeichert und beim nächsten Besuch wiederhergestellt
- Erster Besuch: immer Stumm, egal was in localStorage steht

**Visuelles Feedback auf den Videos:**
- Wenn stumm: Kleines rotes `🔇 Stumm`-Badge oben links auf jedem Video
- Wenn laut: Kleines grünes `🔊 Ton an`-Badge
- Das Badge verschwindet/erscheint sofort wenn der Toggle geklickt wird

### Autoplay-Verhalten

**Trigger-Logik:**
- Ein Video startet automatisch wenn es zu mindestens **60%** im sichtbaren Viewport des Browsers ist
- Es pausiert automatisch wenn es auf unter **20%** Sichtbarkeit fällt
- Technisch umgesetzt via **Intersection Observer API**

**Performance-Schutz:**
- Maximal **2 Videos** spielen gleichzeitig
- Wenn ein drittes Video in den Viewport kommt und die Grenze erreicht, pausiert das älteste der zwei laufenden Videos automatisch

**YouTube-Embeds:**
- Eingebettet als iFrame mit `enablejsapi=1&autoplay=1&mute=1&start={start_seconds}`
- Der Mute-Parameter wird nachträglich über die YouTube IFrame API geändert, wenn der globale Toggle auf Laut geschaltet wird
- Das Video startet immer beim gespeicherten Startpunkt (der vom Ersteller des Kommentars via Scrubber gewählt wurde)

**Twitch-Clips:**
- Eingebettet via Twitch Embed JavaScript SDK
- Die `muted`-Property wird programmatisch gesetzt und reagiert auf den globalen Toggle
- Autoplay bei Sichtbarkeit, Pause bei Unsichtbarkeit

**Mobile-Browser-Einschränkung:**
- Mobile Browser verhindern aus Policy-Gründen Autoplay mit Ton generell
- Wenn der Toggle auf „Laut" gestellt wird auf einem mobilen Gerät, erscheint ein Hinweis-Banner: „Auf diesem Gerät kannst du den Ton direkt im Video-Player aktivieren"
- Autoplay (stumm) funktioniert trotzdem auf Mobile

---

## 9. Clip-Archiv

### Übersicht

Das Clip-Archiv unter `/clips` ist eine kuratierte Sammlung aller YouTube-Videos und Twitch-Clips, die von der Community zu Glossar-Begriffen verlinkt wurden. Es ist keine eigenständige Video-Hosting-Plattform — alle Clips sind externe Links zu YouTube oder Twitch.

### Clip-Karte (Darstellung)

Jeder Clip in der Listenansicht zeigt:
- Video-Thumbnail (von YouTube/Twitch API)
- Videotitel + Channel-Name
- Startpunkt-Zeitcode in Glegg-Orange (`12:34`)
- Verlinkte Glossar-Begriffe als Chips
- Upvote-Zähler
- Kommentar-Anzahl
- Badges (z.B. „Hall of Fame", „Lore", „Clip der Woche")
- Hinzugefügt von (Username) + Datum

### Clip-spezifische Features

**Timecode-Kommentare:**
Kommentare unter einem Clip können an einen Timecode gebunden sein. Das bedeutet: Der Kommentar hat zusätzlich zur normalen Text/Medien-Funktion ein optionales Timecode-Feld. Wenn ein Zuschauer auf einen solchen Kommentar klickt, springt das eingebettete Video auf diesen Timecode. Das Prinzip ist ähnlich wie bei SoundCloud-Kommentaren auf der Wellenform.

**Timecode-Kriege:**
Mehrere Community-Mitglieder können für denselben Clip verschiedene Timecodes einreichen mit der Begründung „Das ist der beste Moment". Die Community votet per Upvote/Downvote welcher Timecode tatsächlich der relevanteste ist. Der am höchsten gevotete Timecode wird als Standard-Startpunkt für den Clip angezeigt.

**Clip-Tags & Begriff-Verknüpfung:**
Ein Clip kann mehrere Glossar-Begriffe belegen. Jede Verknüpfung erscheint auch auf der Detail-Seite des jeweiligen Begriffs als „Belegclip". Ein Clip, der 5 verschiedene Begriffe belegt, erscheint auf 5 verschiedenen Begriff-Seiten.

**Hall of Fame:**
Die 10 am höchsten gevoteten Clips aller Zeiten erhalten den goldenen „Hall of Fame"-Badge und erscheinen permanent auf der Startseite in einem eigenen Bereich.

**Clip der Woche:**
Wöchentlich gewählter Top-Clip durch Community-Voting. Erscheint prominent auf der Startseite und im Clip-Archiv mit eigenem Banner.

**Clip-Compilation-Voting:**
Community-Mitglieder können Clips zu thematischen Compilations zusammenstellen (z.B. „Die 5 besten Gegläggmirt-Momente"). Andere Nutzer können die Reihenfolge der Clips durch Drag-and-Drop-Voting verändern. Die final gevotete Reihenfolge wird als „offizielle Community-Compilation" angezeigt.

---

## 10. Admin- & Moderator-Rechteverwaltung

### Grundprinzip: Discord ID als Vertrauensanker

Admins werden **nicht** über einen Datenbank-Toggle oder ein UI-Formular erkannt, sondern über eine hartcodierte **Discord-ID-Whitelist** im Backend. Das bedeutet: Selbst wenn jemand die Datenbank kompromittiert und einen Wert auf `is_admin: true` setzt, nützt das nichts — der echte Berechtigungscheck im Backend läuft immer gegen die ID-Liste im Code.

**Standard-Admin-ID (Projektgründer):** `303835609762627586`

Weitere Admins werden ausschließlich durch Ergänzung ihrer Discord ID in dieser Whitelist ernannt — nie durch ein Webinterface. Es gibt keinen „Admin ernennen"-Button auf der Website.

### Rollenhierarchie

```
Besucher (anonym)
  └── Eingeloggter Nutzer (Discord OAuth)
        └── Moderator (von Admin ernannt, per Discord ID)
              └── Admin (Discord ID Whitelist im Backend-Code)
```

### Moderations-Log

Jede Aktion die eine erhöhte Berechtigung erfordert wird automatisch protokolliert mit Timestamp, ausführender Discord ID, betroffener Ressource und Aktion. Admins sehen das vollständige Log aller Mods. Mods sehen ausschließlich ihre eigenen Einträge. Das Log ist nicht löschbar — auch nicht durch Admins.

---

### Rechteübersicht: Einträge & Glossar

| Aktion | Admin | Moderator | Hinweis |
|--------|-------|-----------|---------|
| Einträge aus Queue freischalten | ✅ | ✅ | |
| Einträge ablehnen / zurück in Queue | ✅ | ✅ | |
| Einträge direkt bearbeiten (ohne Queue) | ✅ | ✅ | |
| Einträge für Bearbeitungen sperren | ✅ | ✅ | Sperrbegründung ist öffentlich sichtbar |
| Einträge dauerhaft löschen | ✅ | ❌ | Nicht rückgängig machbar — nur mit doppelter Bestätigung im UI |
| „Gleggmire-verifiziert"-Badge setzen | ✅ | ❌ | Nur Admin |
| Geheime Einträge (Easter Eggs) anlegen | ✅ | ❌ | Nur Admin |
| Aliases / Synonyme verwalten | ✅ | ✅ | |
| Bestreitungen manuell beenden | ✅ | ✅ | Mod kann nur schließen, nicht das Ergebnis überschreiben |

### Rechteübersicht: Kommentare & Clips

| Aktion | Admin | Moderator | Hinweis |
|--------|-------|-----------|---------|
| Kommentare löschen / ausblenden | ✅ | ✅ | |
| Clips aus dem Archiv entfernen | ✅ | ✅ | |
| Hall of Fame manuell verwalten | ✅ | ❌ | Clips pinnen/entfernen unabhängig von Votes |
| Anonyme Kommentar-Autoren einsehen | ✅ | ❌ | Nur hinter zusätzlicher Bestätigungsabfrage sichtbar |
| „Clip der Woche" manuell setzen | ✅ | ❌ | Nur Admin |

### Rechteübersicht: Nutzer & Rollen

| Aktion | Admin | Moderator | Hinweis |
|--------|-------|-----------|---------|
| Nutzer sperren (Bann) | ✅ | ✅ | Gesperrte Nutzer können nicht mehr kommentieren oder einreichen |
| Nutzer entsperren | ✅ | ✅ | |
| Moderatoren ernennen / entfernen | ✅ | ❌ | Erkennung über Discord User ID |
| Admins ernennen / entfernen | ✅ | ❌ | Ausschließlich über Backend-Code (ID-Whitelist), kein UI-Button |
| „Lore-Wächter"-Badge manuell vergeben | ✅ | ✅ | Mod kann vorschlagen, Admin muss bestätigen |
| Glegg-Score manuell korrigieren | ✅ | ❌ | Nur Admin |
| „Troll des Monats"-Wahl überschreiben | ✅ | ❌ | Nur Admin |

### Rechteübersicht: Seite & System

| Aktion | Admin | Moderator | Hinweis |
|--------|-------|-----------|---------|
| Seitenweites Notfall-Alert / Breaking News senden | ✅ | ❌ | Nur Admin |
| Wöchentliche Challenge setzen | ✅ | ✅ | Mod kann Entwurf erstellen, Admin muss freischalten |
| Lore-Timeline bearbeiten | ✅ | ❌ | Nur Admin |
| Moderations-Log aller Mods einsehen | ✅ | ❌ | Nur Admin |
| Eigene Mod-Aktionen im Log einsehen | ✅ | ✅ | |
| Starter-Datensatz / Datenbank-Import | ✅ | ❌ | Nur Admin, kritische Aktion |
| Votes / Abstimmungen zurücksetzen | ✅ | ❌ | Nur Admin, kritische Aktion |

### Zusammenfassung: Kritische Aktionen (nur Admin, doppelte Bestätigung im UI)

Folgende Aktionen erfordern eine explizite zweistufige Bestätigung — erst ein „Bist du sicher?"-Dialog, dann nochmals ein Eingabefeld in dem der Admin den Begriff oder die Aktion eintippen muss:

1. Eintrag dauerhaft löschen
2. Anonyme Kommentar-Autoren einsehen (Datenschutz-Warnung vorangestellt)
3. Votes / Abstimmungen zurücksetzen
4. Starter-Datensatz / Bulk-Import ausführen
5. Seitenweites Breaking-News-Alert senden

### Datenbank-Felder: Tabelle `users` (Ergänzung)

Zusätzlich zu den bereits in Kapitel 15 definierten Feldern:

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `discord_id` | String | Primärer Vertrauensanker — wird gegen Backend-Whitelist geprüft |
| `is_admin` | Boolean | Wird **nur** gesetzt wenn `discord_id` in der Backend-Whitelist enthalten ist — nie manuell über UI |
| `is_moderator` | Boolean | Wird von einem Admin über das Moderations-Panel gesetzt |
| `is_banned` | Boolean | Gesperrt — kein Kommentieren oder Einreichen möglich |
| `banned_by` | UUID (nullable) | Discord ID des Admins/Mods der den Bann ausgesprochen hat |
| `banned_at` | Timestamp (nullable) | Zeitpunkt des Banns |
| `ban_reason` | String (nullable) | Interne Begründung (nur für Admins/Mods sichtbar) |
| `mod_action_count` | Integer | Anzahl eigener Moderationsaktionen (für Mod-Statistik) |

---

## 11. Community-Features

### Glegg-Score System

Jeder eingeloggte Nutzer hat einen persönlichen „Glegg-Score" der sich aus verschiedenen Aktionen ergibt. Der Score wird öffentlich auf dem Profil angezeigt.

**Punkte-Quellen:**
- Glossar-Eintrag einreichen und freischalten lassen: **+50 Punkte**
- Einen Clip verlinken der upvoted wird: **+10 Punkte pro Upvote**
- Kommentar schreiben der Upvotes bekommt: **+2 Punkte pro Upvote**
- Einen falschen Eintrag erfolgreich bestreiten (Community bestätigt): **+30 Punkte**
- Eigenen Eintrag erfolgreich gegen Bestreitung verteidigen: **+20 Punkte**
- Timecode-Kommentar der als „bester Timecode" gewählt wird: **+25 Punkte**
- Jemand anderen erfolgreich ratioen (Kommentar wird ratioed): **+15 Punkte**

### Badges & Titel

Nutzer können durch bestimmte Aktionen Badges freischalten, die auf ihrem Profil und neben ihrem Namen sichtbar sind:

| Badge | Bedingung |
|-------|----------|
| 🏆 **Erster Gleggmire** | Erster freigeschalteter Eintrag |
| 👑 **Ratio-König** | 10x einen Kommentar erfolgreich geratioed |
| 😭 **Cope-Architekt** | 5x einen Begriff mit maximalem Cope-Wert (>90%) eingetragen |
| 📚 **Lore-Wächter** | 50+ akzeptierte Einträge (gibt Moderations-Rechte) |
| 🎬 **Clip-Jäger** | 25+ verlinkte Clips |
| 🎯 **Timecode-Meister** | 10x als bester Timecode gewählt |
| 🌟 **Troll des Monats** | Monatliche Community-Wahl |
| 🔍 **Schleimbeutel-Veteran** | Über 365 Tage aktiver Nutzer |
| 🚫 **Bestritten-Überlebender** | Eigenen Eintrag erfolgreich gegen Bestreitung verteidigt |

### Reaktions-System

Statt Standard-Emojis gibt es Community-spezifische Reaktionen auf Kommentare und Einträge:

- **W** (Win) — Zustimmung
- **L** (Loss) — Ablehnung ohne Downvote-Gewichtung
- **Ratio** — Respekt für einen guten Ratio
- **Cope** — Jemand copet gerade
- **Seethe** — Jemand seethed
- **Gegläggmirt** — Das ultimative Urteil
- **Kek** — Allgemeine Belustigung

Die Community kann neue Reaktionen vorschlagen (mit Upvote-System zur Freischaltung).

### Wöchentliche Challenges

Jeden Montag erscheint eine neue Community-Challenge auf der Startseite, z.B.:
- „Diese Woche: Findet den Clip in dem Gleggmire den Begriff X zum ersten Mal benutzt"
- „Diese Woche: Schreibt die beste Alternative-Definition für [Begriff]"
- „Diese Woche: Welcher Begriff hat das höchste Cope-Potential? Nominiert und votet"

Teilnehmer sammeln Bonus-Glegg-Score. Der Gewinner bekommt eine Woche lang ein goldenes Highlight auf seinem Profil.

### Troll des Monats

Jeden ersten des Monats wird der „Troll des Monats" gewählt. Community-Mitglieder nominieren sich gegenseitig über einen speziellen Nominierungs-Button. Die Wahl läuft in den letzten 7 Tagen des Monats. Der Gewinner bekommt:
- Ein dauerhaftes Badge
- Einen speziellen Profilbanner für den Folgemonat
- Einen eigenen Eintrag im „Troll des Monats"-Archiv

---

## 12. Troll-Features

### Ratio-Mechanik

Wenn ein Eintrag oder Kommentar mehr Downvotes als Upvotes hat (Verhältnis > 1:1), erscheint ein großes animiertes `RATIO'D`-Banner über dem Eintrag. Das Banner flackert, hat einen dramatischen roten Hintergrund im XP-Fehler-Stil und kann nur durch die Community wieder entfernt werden (wenn das Verhältnis sich umkehrt). Der Eintrag selbst bleibt — er wird nur sichtbar „geschämt".

### Löschungs-Petition

Nutzer können für jeden Eintrag eine „Petition zum Löschen" starten mit einer Begründung. Der Zähler ist öffentlich sichtbar. Wenn genug Stimmen zusammenkommen: Große Konfetti-Animation... aber der Eintrag bleibt natürlich trotzdem. Der Petition-Zähler wird zurückgesetzt und ein neuer „Petition gescheitert"-Badge erscheint am Eintrag.

### Glegg-Translator

Ein eigenes Tool (erreichbar via Button in der Navigation oder auf einer eigenen Unterseite): Beliebigen deutschen Text einfügen und er wird in Gleggmire-Sprache übersetzt — normale Wörter werden durch Glossar-Begriffe ersetzt, zufällige Verstärkungen werden eingefügt. Das Ergebnis ist nutzlos aber unterhaltsam.

### Notfall-Alert-System

Gleggmire selbst oder verifizierte Moderatoren können eine seitenweite „Breaking News"-Benachrichtigung auslösen. Diese erscheint als dramatisches, pulsierendes rotes Banner oben auf allen Seiten, im Stil einer Windows-XP-Systembenachrichtigung, mit echtem oder erfundenem Gleggmire-Universum-News.

### Gesperrte Einträge mit Begründung

Moderatoren können Einträge für Bearbeitungen sperren. Die Sperrungs-Begründung ist öffentlich sichtbar und muss im Gleggmire-Ton gehalten sein, z.B.:
- „Gesperrt wegen zu viel Cope in der Edit-History"
- „Gesperrt bis Gleggmire das persönlich bestätigt hat"
- „Gesperrt weil jemand versucht hat den Begriff in etwas Seriöses umzuschreiben"

### Zufalls-Glegg (Roulette)

Auf `/zufall` befindet sich ein großer Button mit Slot-Machine-Animation. Beim Klick dreht sich eine Trommel und zeigt zufällige Begriffe. Nach 2-3 Sekunden bleibt sie bei einem zufälligen Eintrag stehen. Dieser Begriff wird dann vollständig angezeigt.

### Cope-O-Meter Battles

Zwei Begriffe treten gegeneinander an: Wer hat mehr Cope? Community stimmt ab. Diese Battles werden wöchentlich automatisch generiert (je zwei zufällige Einträge). Ein monatliches Turnier krönt den „Cope-Champions des Monats".

### Anonym-Modus

Kommentare können anonym abgeschickt werden. Anonyme Kommentare erscheinen mit dem Usernamen „Anonymer Schleimbeutel" (jedes Mal zufällig aus einer Liste von ~50 Varianten wie „Anonymer Schleimbeutel #4711", „Unbekannter Cop-Troller" etc.). Der echte Username wird nur für Moderation-Zwecke hinter den Kulissen gespeichert.

### Begriff-Verschwörungstafel

Eine interaktive Pinnwand auf einer eigenen Seite (`/lore-tafel`). Nutzer können Begriffe als Post-It-Notes platzieren und mit roten Schnüren verbinden. Verbindungen können mit eigenen Theorien kommentiert werden. Die Tafel ist öffentlich und jeder eingeloggte Nutzer kann Post-Its hinzufügen und verbinden. Die Tafel wird nicht moderiert (absichtlich chaotisch).

### Fake-Übersetzung

Ein „Übersetze auf Englisch"-Button bei jedem Begriff öffnet ein XP-Dialog-Popup mit einer absichtlich falschen, wörtlichen Übersetzung ins Englische. Beispiel: „Gegläggmirt" → „Has been through the Gleggmire process" (aber absurd falsch und wörtlich auf Deutsch basierend).

### Dekorative Titelleisten-Buttons

Die `✕`-, `▢`- und `—`-Buttons in den XP-Fenster-Titelleisten sind klickbar und tun lustige Dinge:
- `✕` (Schließen): Öffnet einen XP-Fehler-Dialog: „Fenster kann nicht geschlossen werden. Der Eintrag existiert weiterhin."
- `▢` (Maximieren): Die Karte vergrößert sich kurz dramatisch und springt dann zurück
- `—` (Minimieren): Die Karte „minimiert" sich in die untere Ecke und bleibt dort winzig bis man draufklickt

---

## 13. Easter Eggs & Meta-Features

### Konami-Code

Wenn ein Nutzer auf der Website den Konami Code eingibt (↑↑↓↓←→←→BA), wird für 10 Sekunden der „Chaos-Modus" aktiviert:
- Alle Glossar-Begriffe auf der aktuellen Seite werden zufällig durchgeschüttelt und neu angeordnet
- Schriftarten wechseln zu absurden Windows-Systemschriften
- Hintergrundfarbe dreht sich durch alle XP-Systemfarben
- Nach 10 Sekunden alles zurück zum Normal-Zustand

### Geheime Einträge

Bestimmte Begriffe existieren nur wenn man die genaue URL kennt (`/glossar/[geheimer-slug]`). Sie tauchen nicht in der Suche, nicht in der Listenansicht und nicht in der Navigation auf. Gleggmire kann diese Slugs in seinen Videos oder Streams nennen und die Community muss die Easter-Egg-Seite finden. Die Seiten können spezielle Designs, Extra-Inhalte oder besondere Clips enthalten.

### Gleggmire-Verifizierung

Gleggmire selbst kann einen verifizierten Account haben mit:
- Goldener Krone neben dem Namen
- Spezieller goldener Titelleiste in XP-Stil statt der normalen blauen
- Seine Kommentare erscheinen immer als erste unter jedem Eintrag und sind visuell hervorgehoben
- Er kann Einträge mit einem „✓ Von Gleggmire bestätigt"-Badge versehen

### Uhrzeit-Events

Zu bestimmten Uhrzeiten verändert sich die Website subtil:
- **04:20 Uhr:** Ein spezielles Banner erscheint für 5 Minuten. Inhalt nach Wahl (Gleggmire-Referenz)
- **Nachts (00:00–06:00):** Hintergrund wird etwas dunkler, eine Nachteule erscheint im Footer

### Retro-Besuchs-Zähler

Im Footer oder in der Sidebar: Ein alter Internet-Counter à la 2001 im Stil eines mechanischen Zählers: „Besuche: 69.420" (startet natürlich bei 69.420). Der echte Zähler läuft darunter, wird aber als Rollen-Animation nur um 1 erhöht pro Besuch, nie zurückgesetzt.

### Lore-Timeline

Eine interaktive Zeitlinie unter `/lore` die chronologisch zeigt:
- Wann welcher Begriff zum ersten Mal in einem Video aufgetaucht ist
- Wichtige Ereignisse in der Gleggmire-Community-Geschichte
- Erste und letzte Erwähnungen von Begriffen
- Navigierbar mit einem horizontalen Scrubber (Ironie: auch hier ein Scrubber)

### Discord-Bot API

Eine öffentliche, kostenlos nutzbare REST-API unter `gleggmire.net/api/v1/`:
- `GET /api/v1/terms` — Alle Begriffe (paginiert)
- `GET /api/v1/terms/{slug}` — Ein einzelner Begriff mit voller Definition
- `GET /api/v1/terms/random` — Ein zufälliger Begriff

Gedacht für Discord-Bots auf Community-Servern: `!glegg [Begriff]` → Bot antwortet mit Definition, Beispielsatz und Cope-O-Meter-Wert.

### Melde-Button (funktionslos)

Jeder Eintrag hat einen „⚑ Melden"-Button. Dieser tut **nichts** — beim Klick erscheint ein XP-Infobox-Dialog: „Ihre Meldung wurde von Gleggmire persönlich geprüft und mit freundlichem Kopfschütteln abgelehnt." OK-Button schließt den Dialog.

---

## 14. Tech-Stack Empfehlung

### Frontend

- **Framework:** Next.js 14+ mit App Router — serverseitiges Rendering für Glossar-Einträge (SEO), Client Components für den Kommentar-Editor und Video-Player
- **Styling:** Tailwind CSS mit einer custom Konfiguration für alle Glegg/XP-Farben und -Abstände
- **Video-Einbettung:** `react-player` Bibliothek — unterstützt YouTube und Twitch nativ, vereinfacht die Mute/Play-API erheblich
- **Autoplay-Detection:** `react-intersection-observer` Hook für den Intersection Observer
- **Globaler State:** `Zustand` State-Management-Library für den globalen Mute-State — synchronisiert alle Video-Komponenten gleichzeitig

### Backend & Daten

- **Backend-as-a-Service:** Supabase (PostgreSQL + Auth + Realtime) — schneller Entwicklungsstart, gut skalierbar, Realtime-Feature für Live-Vote-Counter
- **Authentifizierung:** Discord OAuth via Supabase Auth — passt zur Community, kein separates Account-System nötig
- **Medien-Storage:** Supabase Storage für Bild/GIF-Uploads. YouTube und Twitch werden nur als URL + `start_seconds` gespeichert — kein Re-Hosting der Videos
- **oEmbed-Proxy:** Eigene Next.js API-Route `/api/oembed?url=...` — ruft YouTube/Twitch oEmbed-Daten ab und cacht das Ergebnis um CORS-Probleme zu vermeiden
- **Rate Limiting:** Upstash Redis für Rate-Limiting bei Kommentar-Submissions und Votes (Schutz vor Spam und Bot-Aktionen)

### Hosting

- **Frontend:** Vercel (nahtlose Next.js-Integration)
- **Datenbank & Auth:** Supabase (gehosteter Service)
- **Medien-CDN:** Supabase Storage mit CDN oder alternativ Cloudflare R2

---

## 15. Datenbank-Schema

Das folgende Schema beschreibt die wichtigsten Tabellen der Datenbank konzeptionell. Es ist kein SQL-Code — nur eine Beschreibung der Datenstruktur.

### Tabelle: `glossary_terms`

Enthält alle Glossar-Einträge.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID | Primärschlüssel |
| `slug` | String | URL-freundlicher Name, z.B. `geglaggmirt` |
| `term` | String | Der Begriff, z.B. „Gegläggmirt" |
| `phonetic` | String (nullable) | IPA-Aussprache |
| `word_type` | String (nullable) | Verb, Substantiv, Ausruf etc. |
| `status` | Enum | `pending`, `approved`, `disputed`, `locked` |
| `created_by` | UUID (FK → users) | Ersteller |
| `created_at` | Timestamp | Erstellungsdatum |
| `updated_at` | Timestamp | Letztes Änderungsdatum |
| `is_secret` | Boolean | Ob der Eintrag versteckt ist (Easter Egg) |
| `verified_by_gleggmire` | Boolean | Hat Gleggmire bestätigt |

### Tabelle: `term_definitions`

Bis zu 3 alternative Definitionen pro Begriff (wie Urban Dictionary).

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID | Primärschlüssel |
| `term_id` | UUID (FK → glossary_terms) | Zugehöriger Begriff |
| `definition` | Text | Definitionstext |
| `example_sentence` | Text | Beispielsatz |
| `origin_context` | Text (nullable) | Herkunfts-Beschreibung |
| `submitted_by` | UUID (FK → users) | Einreicher |
| `upvotes` | Integer | Upvote-Zähler |
| `downvotes` | Integer | Downvote-Zähler |
| `cope_meter_sum` | Integer | Summe aller Cope-Votes |
| `cope_meter_count` | Integer | Anzahl Cope-Votes (für Durchschnitt) |

### Tabelle: `comments`

Alle Kommentare auf Begriff-Seiten und Clip-Seiten.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID | Primärschlüssel |
| `parent_id` | UUID (nullable, FK → comments) | Für nestbare Replies |
| `entity_type` | Enum | `term` oder `clip` — auf was kommentiert wird |
| `entity_id` | UUID | ID des Terms oder Clips |
| `user_id` | UUID (nullable, FK → users) | Null wenn anonymer Kommentar |
| `is_anonymous` | Boolean | Anonym-Modus aktiv? |
| `text` | Text (nullable) | Kommentar-Text (optional) |
| `attachment_type` | Enum (nullable) | `image`, `gif`, `youtube`, `twitch` |
| `attachment_url` | String (nullable) | URL des Anhangs oder YouTube/Twitch-Link |
| `attachment_start_seconds` | Integer (nullable) | Nur bei YouTube/Twitch: Startpunkt in Sekunden |
| `upvotes` | Integer | Upvote-Zähler |
| `downvotes` | Integer | Downvote-Zähler |
| `created_at` | Timestamp | Erstellungsdatum |
| `timecode_seconds` | Integer (nullable) | Timecode-Kommentar auf Clip-Seiten: Zeitpunkt im Video |

### Tabelle: `clips`

Alle von der Community verlinkten Videos und Twitch-Clips.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID | Primärschlüssel |
| `source` | Enum | `youtube` oder `twitch` |
| `external_url` | String | Originale YouTube/Twitch-URL |
| `external_id` | String | YouTube-Video-ID oder Twitch-Clip-ID |
| `title` | String | Titel (von oEmbed abgerufen) |
| `duration_seconds` | Integer | Gesamtlänge (von oEmbed abgerufen) |
| `thumbnail_url` | String | Thumbnail-URL |
| `submitted_by` | UUID (FK → users) | Einreicher |
| `submitted_at` | Timestamp | Einreichdatum |
| `upvotes` | Integer | Upvote-Zähler |

### Tabelle: `clip_term_links`

Verknüpfungstabelle zwischen Clips und Begriffen (Many-to-Many).

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `clip_id` | UUID (FK → clips) | Zugehöriger Clip |
| `term_id` | UUID (FK → glossary_terms) | Zugehöriger Begriff |
| `start_seconds` | Integer (nullable) | Optionaler relevanter Startpunkt für diesen Begriff |
| `linked_by` | UUID (FK → users) | Wer die Verknüpfung erstellt hat |
| `upvotes` | Integer | Wie gut belegt dieser Clip den Begriff (Community-voted) |

### Tabelle: `users`

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID | Primärschlüssel (Supabase Auth ID) |
| `discord_id` | String | Discord-User-ID — primärer Vertrauensanker |
| `username` | String | Anzeigename |
| `avatar_url` | String (nullable) | Discord-Avatar |
| `glegg_score` | Integer | Aktueller Glegg-Score |
| `is_gleggmire` | Boolean | Verifizierter Gleggmire-Account |
| `is_admin` | Boolean | Wird nur gesetzt wenn `discord_id` in Backend-Whitelist — nie manuell |
| `is_moderator` | Boolean | Moderatoren-Rechte (von Admin gesetzt) |
| `is_banned` | Boolean | Gesperrt vom Kommentieren/Einreichen |
| `banned_by` | UUID (nullable) | Discord ID des bannenden Admins/Mods |
| `banned_at` | Timestamp (nullable) | Zeitpunkt des Banns |
| `ban_reason` | String (nullable) | Interne Begründung (nur Admins/Mods sichtbar) |
| `joined_at` | Timestamp | Registrierungsdatum |

### Tabelle: `comment_ip_log` (DSGVO-relevant)

Speichert IP-Adressen aller Kommentar-Submissions für Strafverfolgungszwecke. **Diese Tabelle ist ausschließlich über das Admin-Backend einsehbar — nie über die öffentliche API.** Automatische Löschung nach 90 Tagen.

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | UUID | Primärschlüssel |
| `comment_id` | UUID (FK → comments) | Zugehöriger Kommentar |
| `ip_address` | String | IP-Adresse des Verfassers zum Zeitpunkt des Abschickens |
| `user_agent` | String (nullable) | Browser-User-Agent (für forensische Zwecke) |
| `submitted_at` | Timestamp | Zeitpunkt des Submits |
| `delete_at` | Timestamp | Berechnetes Löschdatum (= `submitted_at` + 90 Tage) — Grundlage für automatischen Purge-Job |

> ⚠️ **Entwickler-Hinweis:** Ein täglich laufender Cron-Job (z.B. via Supabase Edge Functions oder Railway Cron) löscht alle Einträge wo `delete_at < NOW()`. Die Existenz dieses Logs und die 90-Tage-Frist müssen in der Datenschutzerklärung unter `/datenschutz` transparent kommuniziert werden.

---

## 16. Starter-Datensatz: Das Glexicon

Diese Begriffe wurden direkt aus den Gleggmire-Videos extrahiert und dienen als vorbefüllter Starterinhalt der Datenbank beim Launch. Sie sind **bereits freigeschaltet** (kein Moderations-Queue nötig) und mit dem YouTube-Quellenlink und Timecode versehen. Jeder Eintrag ist als von Gleggmire verifiziert (`verified_by_gleggmire: true`) zu markieren, da sie direkt aus seinen Videos stammen.

### Quelle: Video 1 (2024)

Die genauen Timecodes und Definitionen des ersten Videos sind gesondert zu ergänzen sobald verfügbar.

### Quelle: Video 2 — „Zuschauer erstellen den Gleggmire Duden"

YouTube-URL: `https://www.youtube.com/watch?v=bJGv-LhdIPE`

Alle Einträge unten enthalten: Begriff · Timecode · Definition · Kategorie-Tags. Aliasse sind wo sinnvoll bereits hinterlegt.

---

| Begriff | Timecode | Definition | Tags | Aliasse |
|---------|----------|-----------|------|---------|
| **Situationsbedingt** | 01:45 | Informeller Ausdruck, oft als Frage verwendet, um eine Person zu provozieren oder eine Reaktion zu testen. | Trolling, Provokation | — |
| **Sirs (SS)** | 02:26 | Informelle Begrüßung im Gefangenen-RP, um nicht aus der Rolle zu fallen. | GTA RP, Begrüßung | SS |
| **Luftgaming** | 03:00 | Gaming-Aktivitäten die in der Luft stattfinden, z.B. im Flugzeug. | Gaming, Meta | — |
| **Zaubermagnada** | 03:45 | Ein Gegenstand / Zauberstab aus der fiktiven Substanz „Magnada". | Lore, Items | Magnada |
| **Fick Manu** | 04:13 | Alter Insider. Vulgäre Aufforderung an eine Person namens Manu, sich zu entfernen. | Insider, Vulgär | — |
| **Slices** | 04:49 | Jemanden im Spiel mit einem Messer stechen (in den Allerwertesten). | GTA RP, Gewalt | — |
| **Lungen-Torpedo** | 05:20 | Synonym für eine bestimmte Art zu rauchen im Spiel. | GTA RP, Rauchen | Kräuterlunte |
| **Kräuterlunte** | 05:20 | Synonym für Lungen-Torpedo. Andere Art des Rauchens im RP. | GTA RP, Rauchen | Lungen-Torpedo |
| **Kanackentasche** | 05:55 | Anderes Wort für Döner. | Essen, Slang | — |
| **Goi** | 06:21 | Beschreibt eine unangenehme, langweilige oder öde Situation. | Gefühl, Reaktion | Gy, Schleim, Verschleimt |
| **Gy** | 06:21 | Alias für Goi. | Gefühl, Reaktion | Goi |
| **Schleim** | 06:50 | Gleichbedeutend mit Goi — wenn etwas mega öde oder komisch ist. | Gefühl, Reaktion | Goi, Verschleimt |
| **Verschleimt** | 06:50 | Zustand der Schleimigkeit. Gleichbedeutend mit Goi. | Gefühl, Reaktion | Schleim, Goi |
| **Steifen RP** | 07:21 | Wenn man im Rollenspiel eine unangenehme, peinliche oder „steife" Situation erlebt. | GTA RP, Klassiker | — |
| **Styling Gel** | 08:13 | Wenn einem im Spiel die Haare vom Kopf fallen. Metapher für eine unerwartete negative Veränderung. | Meta, Humor | Haarglatzfall |
| **Haarglatzfall (erblich bedingt)** | 08:13 | Alias für Styling Gel. Wenn man plötzlich kahl wird. | Meta, Humor | Styling Gel |
| **Komplett** | 09:07 | Absolute Zustimmung oder Situation des Grauens. Wird mit einem „O" der Finger ausgedrückt. | Reaktion, Klassiker | — |
| **Kaniel** | 09:52 | Bezeichnung für den YouTuber Kaniel Lizi (Daniel / Danileigh). | Personen, Insider | Kaniel Lizi |
| **Drecksgaul** | 10:08 | Liebevoll-beleidigender Begriff für ein Pferd im Spiel. | GTA RP, Tiere | — |
| **Lattenrost** | 10:40 | Vielseitig nutzbarer Begriff, oft im Kontext Bett/Schlafen. | Slang, Meta | — |
| **Verschmieren** | 10:58 | Eine Flüssigkeit oder einen Gegenstand zwischen den Händen verreiben. Immer mit „schön" davor. | Aktion, Vulgär | — |
| **Ejakulat** | 11:24 | Teil von „schön verschmieren". Wird als Teil dieser Aktion definiert. | Vulgär, RP | — |
| **Snench** | 11:43 | Alternatives Wort für Mensch. | Slang, Ersatzwort | — |
| **Schießens** | 11:55 | Wenn man im Spiel schießt. Das „s" am Ende ist Teil des Begriffs. | GTA RP, Aktion | — |
| **Auto bepimpen** | 12:15 | Das Auto von jemandem im Spiel komplett tunen. | GTA RP, Fahrzeuge | — |
| **Fick Toast** | 12:36 | Ein Toast mit einem Loch in der Mitte. | Essen, Humor | — |
| **Schwakau** | 13:00 | Abkürzung für „Schwanz kauen" — sexuelle Handlung im Spiel. | Vulgär, RP | Schwa |
| **Peblow** | 13:13 | Jemandem im Spiel den Penis blasen (anblowen). | Vulgär, RP | — |
| **DFZ** | 13:48 | Ein Furz im Rollenspiel. Abkürzung für „Dicker Forz". | GTA RP, Humor | Forz im RP |
| **Eigene Meimung** | 13:55 | Die eigene Meinung. Absichtlich mit „m" statt „n" geschrieben. | Slang, Rechtschreibung | Meimung |
| **Angeschniedelt** | 14:05 | Wenn man jemanden bereits stark provoziert und in die Enge getrieben hat. | Trolling, Zustand | — |
| **Sar** | 14:34 | Leute die Marcel heißen — aber in einer besseren Version. | Personen, Insider | — |
| **Abend** | 14:44 | Simple Begrüßung. | Begrüßung | Nabend |
| **Nabend** | 14:44 | Kurzform von „Guten Abend". Simple Begrüßung. | Begrüßung | Abend |
| **Querlatte** | 14:44 | Eine Platte mit einem 45-Grad-Winkel. | Objekte, Slang | — |
| **Kühles Blondes** | 15:03 | Ein Bier. | Getränke, Slang | — |
| **Ja ja ja ja ja (Pü)** | 15:09 | Geräusch zur Bestätigung im Gefangenen-RP um nicht aufzufallen. | GTA RP, Begrüßung | Pü |
| **Packlam** | 15:51 | Name den man in Zoom-Meetings grundlos herausschreit. | Meta, Humor | Freeman |
| **Freeman** | 15:51 | Alias für Packlam. Ebenfalls ein in Zoom-Meetings gerufener Name. | Meta, Humor | Packlam |
| **Ejakulat als Mousepad benutzen** | 16:01 | Genau das — im Spiel. | Vulgär, RP | — |
| **Unterweisen Sie mich** | 16:14 | Versprechen an einen Meister im Star Wars RP, der Stärkste zu werden. | Star Wars RP, Lore | — |
| **Popo Blanco** | 16:40 | Jemandem den Hintern so lecken, dass er komplett blank ist. | Vulgär, RP | — |
| **Die Ballers** | 17:06 | Leute die Teil der Ballers-Gang/Gruppierung sind. | GTA RP, Gangs | Ballers |
| **Selber geil** | 17:15 | Wenn jemand etwas einfach selbst geil findet — und das auch so kommuniziert. | Reaktion, Slang | — |
| **Halsgang** | 17:37 | Ein Doppelkinn. | Körper, Humor | — |
| **Hände in die Höhe** | 17:46 | RP-Aufforderung die Hände hochzumachen. | GTA RP, Cops | — |
| **Scheiße sagt man nicht, Scheiße trinkt man** | 18:01 | Humorvoller Spruch. Selbsterklärend. | Sprüche, Klassiker | — |
| **Luxuriöse Luxusyacht** | 18:01 | Eine Yacht, die durchaus sehr luxuriös ist. Betonung auf Luxus. | Objekte, Humor | — |
| **Spesendeckung** | 18:20 | Wenn der Chef alle Ausgaben deckt. | Meta, Business | — |
| **Rumpschwangern** | 18:33 | Wenn man im RP schwanger herumläuft. | GTA RP, Humor | — |
| **Latte blanchieren** | 18:46 | Die Latte (Penis) von jemandem zum Überkochen bringen. | Vulgär, RP | — |
| **Plattfuß** | 19:10 | Ein orthopädisch platter Fuß. | Körper, Humor | — |
| **Definitiv** | 19:29 | Wenn etwas einfach sicher und absolut ist. | Zustimmung, Slang | Finde ich |
| **Sex Cola** | 20:09 | Eine sehr kalte, frische Cola. Das Erlebnis ist fast sinnlich. | Getränke, Humor | — |
| **Kackdusche** | 20:30 | Die Dusche auf einer Luxusyacht. Klingt schlimmer als sie ist. | Objekte, Humor | — |
| **Vergeilt** | 20:39 | Wenn etwas überdurchschnittlich geil ist. Steigerung von geil. | Reaktion, Slang | — |
| **Aufspritzen** | 20:58 | Vulgärer Begriff am Ende des Videos. | Vulgär, RP | — |

### Weitere Begriffe aus der kombinierten Liste (Video 1 + 2)

Diese Begriffe sind ebenfalls Teil des Starter-Datensatzes, ihre genauen Timecodes aus Video 1 sind noch zu ergänzen:

| Begriff | Definition | Tags | Aliasse |
|---------|-----------|------|---------|
| **Auf den Schlüpper treten** | Jemandem zu nahe treten. | Trolling, Provokation | — |
| **Beste Kopf** | Wenn eine Situation einfach das „beste Leben" ist. | Reaktion, Positivität | — |
| **Cremescheiße** | Kot in einem sehr cremigen Zustand. | Vulgär, Humor | — |
| **Folgendermaßen** | Wenn etwas in einer bestimmten Art und Weise erfolgt. Einleitungsformel. | Slang, Ausdruck | Folgender Basit |
| **Haartattoo** | Schmerzfreie Alternative zur Haartransplantation. | Humor, Meta | — |
| **Igelbau** | Zustand in dem etwas vollkommen „Firma" ist. | Zustand, Slang | — |
| **Knackig** | Etwas das knackt und Widerstand bietet. | Beschreibung, Slang | — |
| **Kniepel** | Alternatives Wort für den Penis. | Vulgär, Slang | Schniepel, Pilo |
| **Konzisch** | Jemand der sich als Experte (Connaisseur) auskennt. | Beschreibung, Ironie | — |
| **Martin** | Die reale Persönlichkeit / der echte Name des YouTubers. | Personen, Meta | — |
| **Muckelig** | Unnormal gemütlich. Steigerung von gemütlich. | Gefühl, Slang | — |
| **Orschotz** | Jemanden auf den Allerwertesten erbrechen. | Vulgär, RP | Schwanzkotz |
| **Pilo** | Verniedlichungsbegriff für Schniepel/Kniepel. | Vulgär, Verniedlichung | Kniepel |
| **Pobert** | Lustiger Ersatz für den Namen Robert. | Namen, Humor | — |
| **Pokomäne** | Bezeichnung für die Möbelkette Poco als Einzelhandelsdomäne. | Orte, Meta | — |
| **Samuel** | Synonym für einen NPC im Spiel. | GTA RP, Personen | — |
| **Schwakau / Schwa** | Slangwort das angeblich vom YouTuber in Deutschland populär gemacht wurde. Auch: Schwanz kauen. | Slang, Lore | Schwakau |
| **Uncancelbarkeit** | Der Zustand absolut nicht gecancelt werden zu können. | Meta, Zustand | — |
| **Von alleine** | Wenn etwas vollkommen ohne Fremdeinwirkung passiert. | Ausdruck, Meta | — |
| **Was zum Schradin** | Ausruf der Verwunderung oder des Entsetzens. | Ausruf, Reaktion | — |
| **Werder Flakes** | Humorvolle Abwandlung von „Werner in die Cornflakes". | Humor, Referenz | — |
| **xxx Loots** | Kontrahent zur Pokomäne. Bezieht sich auf XXXLutz. | Orte, Meta | XXXLutz |

### Daten-Import-Hinweis für die Entwicklung

Beim initialen Daten-Import gelten folgende Sonderregeln für alle Starter-Datensatz-Einträge:

- `status: approved` — alle Starter-Einträge sind sofort freigeschaltet, keine Moderations-Queue
- `verified_by_gleggmire: true` — da die Inhalte direkt aus seinen Videos stammen
- `created_by: system` — ein System-Account als Ersteller, kein echter User
- Für Einträge mit bekanntem Timecode: `source_video_url` und `source_start_seconds` werden befüllt
- Für Einträge deren Timecode aus Video 1 noch fehlt: `source_video_url: null`, nachzutragen durch Community

---

*Dokument erstellt für die Entwicklung von gleggmire.net — Inoffizielles Fan-Projekt, nicht affiliiert mit Gleggmire. Beschwerden & Kontakt: Discord `tetrxs`*
