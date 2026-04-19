# London 2026 Trip App — Architecture

## Overview

A Progressive Web App (PWA) serving as an offline-capable interactive trip guide for David and Paula's London marathon trip (April 20–28, 2026). Built as a single-page HTML/CSS/JS application with service worker caching for full offline capability.

## Architecture Decision: PWA over Native Android

**Decision:** Build as a PWA rather than a native Android app.

**Why:**
- Existing HTML prototype provides 80% of the UI — minimal rework needed
- PWA installs directly from Chrome ("Add to Home Screen") — no app store
- Full offline support via service worker — critical for London Tube (no signal underground)
- Both David and Paula can install independently by visiting the same URL or opening the HTML file
- Trip is ~3 weeks away — PWA is fastest path to a working app
- Shares architecture patterns with Project Phil (also HTML-based)

**Trade-offs accepted:**
- No push notifications (not in MVP anyway)
- No background sync between devices (each phone has its own copy)
- Limited to what the browser can do (sufficient for our needs)

## System Components

### 1. UI Layer (`index.html` + inline CSS/JS)
Single-file PWA containing all markup, styles, and logic. Key UI components:
- **Hero header** with trip title and date range
- **Day pill navigation bar** (sticky, scrollable) for jumping between days
- **Expandable day cards** with stops, times, details, and tags
- **Transport direction callouts** with step-by-step board/ride/transfer/exit icons
- **Ticket viewer** — embedded PDF viewer per activity (Tower of London, Westminster Abbey, British Museum)
- **Reservation tags** — color-coded with who booked and party size
- **Resources page** — emergency contacts, medical info, cab apps, venue links, travel tips
- **Google Maps navigation** — tappable 📍 links on walk transitions and transport directions for turn-by-turn navigation
- **Venue links** — restaurant, hotel, attraction, and shop names link to official websites
- **Exhibit checklists** — interactive checkboxes for Tower of London, Westminster Abbey, British Museum, and Churchill War Rooms with localStorage persistence
- **Birds to Spot** — quiet wink for the bird-loving users: a collapsed `🐦 Birds nearby` chip on each day card (location-matched to that day's stops, shows 0–2 species) and a "🐦 Birds to Spot" group on the Resources page with a tappable spotted-checklist and live "X of N spotted" counter. localStorage keys: `birds-dp-spotted` (David & Paula app, 7 London species matched by day number) and `birds-mom-spotted` (Mom & Dad app, 14 species matched by `day.weather.location` across Bath / Cotswolds / London). London bird copy stays in sync across both files.
- **MJFF marathon branding** — marathon day uses Michael J. Fox Foundation orange (#e07800) with Team Fox fundraising link
  - **Marathon race-day operations** — full start info (bib #60613, Blue assembly, Wave 10, 10:23 start), transport to Blackheath, on-course hydration/aid by mile, post-finish logistics with meeting points
  - **Race prep checklist** — Saturday evening checklist for bib pinning, kit layout, alarm, and weather check
  - **Running Show bib pickup** — QR code + photo ID reminder, Event Pack contents checklist on Day 22
- **Live weather** — auto-fetches 16-day London forecast from Open-Meteo API on load; falls back to April averages when offline
- **Dark mode** — automatic via `prefers-color-scheme: dark` media query
- **Today auto-highlight** — during the trip, auto-expands and highlights the current day
- **Collapsible flight bar** — auto-hides mid-trip, toggle to show/hide
- **Back to top button** — floating button appears on scroll for quick navigation
- **Timeline connector** — visual progress dots between stops within each day
- **Travel & Stays card** — collapsible Resources group rendered from a `travelData` constant (flights, confirmation number, hotel address/phone/check-in/check-out). Phone is a `tel:` link, address is a Google Maps link.
- **Marathon Day "Race Mode" banner** — pinned full-width banner at the top of the page that activates only when the local date is 2026-04-26. Live 1-second countdown to Wave 10 start (10:23 AM); flips to "race in progress" then to spectator-timing reminders as the day progresses. Dismissible via sessionStorage.
- **Now-stop highlighting** — during the trip, renders a `📍 Now` badge on the stop whose `time` is nearest the current clock (re-evaluated every 5 min and on visibility change).
- **App version label** — footer shows `App version: vN ✓` when the installed service-worker cache matches the deployed `CACHE_NAME`, or `Installed: vN · Latest: vM — fully close and reopen the app to update` (in marathon orange) when the PWA is stale. Lets non-technical users self-diagnose PWA cache staleness.

### 2. Service Worker (`sw.js`)
Handles offline caching strategy:
- **Cache on install:** Pre-caches the app shell (index.html, manifest, fonts, ticket PDFs)
- **Cache-first strategy:** Serves from cache, falls back to network
- **Versioned cache:** Cache name includes version number for clean updates
- Fonts loaded from Google Fonts are cached on first load

### 3. Web App Manifest (`manifest.json`)
Makes the app installable:
- App name: "London 2026"
- Short name: "London 26"
- Theme color: #2d5a3d (Kensington Garden green)
- Background color: #f7f5f0 (cream)
- Display: standalone (hides browser chrome)
- Orientation: portrait
- App icons at multiple sizes

## Design System: "The Line" (current — Session 17)

As of April 2026, David & Paula's `index.html` uses a refreshed visual system called "The Line" — the itinerary renders as a single vertical tube line with each day as a station and each stop as a dot on the track. The earlier Kensington Garden tokens are retained in `:root` for backwards compatibility but the app scopes the new styles under `body.the-line`. `mom-dad/` still uses Kensington Garden.

### Active tokens — The Line

| Token | Light (hex) | Dark (hex) | Usage |
|-------|-------------|------------|-------|
| --paper | #f7f4ed | #0f1012 | Page background |
| --paper-2 | #efeadd | #191b20 | Inset blocks (transit callouts) |
| --ink | #0e1014 | #f2eee3 | Primary text / numerals |
| --ink-2 | #2d3038 | #cac4b7 | Secondary text |
| --ink-dim | #6a6e78 | #948e80 | Tertiary text, labels |
| --hairline | #d8d3c4 | #2e3037 | Sticky bar borders, checklist dividers |
| --hairline-strong | #0e1014 | #f2eee3 | Hero meta top border, day-head bottom border |
| --line-day | #1f4fb8 | #6f9bff | The line itself, stop times, transit accents |
| --line-day-soft | rgba(31,79,184,.10) | rgba(111,155,255,.18) | Stop-time pill bg |
| --spring-gold | #c9a227 | #e7c35a | Maps button outline/fill, packing/resources pills, today ring |
| --spring-gold-soft | rgba(201,162,39,.14) | rgba(231,195,90,.18) | Maps button fill bg |
| --spring-green | #4a7c3a | #8cc070 | Walk transitions, reservation outline, birds chip |
| --spring-green-soft | rgba(74,124,58,.14) | rgba(140,192,112,.16) | Walk / weather / birds bg |
| --mjff | alias of --marathon-red (#e07800 / #f39437) | — | Marathon day accents (Race Day only) |
| --mjff-soft | rgba(224,120,0,.12) | rgba(243,148,55,.20) | MJFF soft backgrounds, dot halo |

**Typography:**
- **Space Grotesk** (400–700) — numerals, labels, hero wordmark, day/station numbers, stop-time pills, Maps button text.
- **Work Sans** (300–700) — body copy, stop names, details, checklist labels.
- **DM Sans** + **Playfair Display** (legacy) — still loaded and used by untouched sections (Resources, Packing, Modal). May be retired after cleanup.

Font loading: Google Fonts CSS2 import + local `@font-face` fallbacks for offline first-load.

### Legacy tokens — "Kensington Garden" (still defined)

Retained in `:root` so any untouched section or future subagent that still references the old names works. `mom-dad/` app uses these natively.

| Token | Hex | Usage |
|-------|-----|-------|
| --bg | #f7f5f0 | Main background (legacy) |
| --card | #ffffff | Card backgrounds |
| --card-border | #e8e2d8 | Card borders, dividers |
| --primary | #2d5a3d | Headings, day numbers, nav active (legacy) |
| --primary-light | #4a8c62 | Secondary green accents |
| --accent | #c07d3e | Times, gold accents (legacy) |
| --accent-light | #d4a253 | Lighter gold touches |
| --text | #2c2c2c | Body text |
| --text-dim | #7a7568 | Secondary/detail text |
| --tag-reservation | #c07d3e | Reservation tag color (legacy) |
| --tag-ticket | #3a7ca5 | Ticket tag color (legacy) |
| --marathon-red | #e07800 | Marathon day accent (MJFF orange — canonical source of truth, aliased by `--mjff`) |
| --marathon-bg | #fef6ed | Marathon day card bg (legacy) |
| --transport-bg | #eef4f8 | Transport callout bg (legacy) |
| --transport-border | #b8d4e8 | Transport callout border (legacy) |

## Ticket Embedding Strategy

Ticket PDFs are stored in `/tickets/` and embedded in the app using base64-encoded data URIs or `<object>`/`<iframe>` tags for offline viewing. Each ticket-requiring activity has a "View Ticket" button that opens the relevant PDF.

| Attraction | File | Day |
|------------|------|-----|
| Tower of London | tower-of-london.pdf | Day 2 (Apr 22) |
| Westminster Abbey | westminster-abbey.pdf | Day 3 (Apr 23) |
| British Museum | british-museum.pdf | Day 4 (Apr 24) |
| Churchill War Rooms | churchill-war-rooms.pdf | Day 5 (Apr 25) |

## File Structure

```
London Trip App/
├── index.html          # Main PWA (single-file app)
├── sw.js               # Service worker for offline caching
├── manifest.json       # Web app manifest for installability
├── icons/              # App icons (multiple sizes)
├── tickets/            # Ticket PDFs for offline viewing
│   ├── tower-of-london.pdf
│   ├── westminster-abbey.pdf
│   ├── british-museum.pdf
│   └── churchill-war-rooms.pdf
├── ARCHITECTURE.md     # This file
├── DEVELOPMENT.md      # Development roadmap and session log
├── DEPLOY.md           # Non-technical deploy walkthrough
├── CLAUDE.md           # Guidance for Claude Code working in this repo
└── KNOWN-ISSUES.md     # Known issues and follow-ups
```

The editing copy lives in OneDrive; the deploy copy (with git remote) lives at `C:\Users\hensl\repos\london-2026` → `1davidhensley/london-2026`. See `DEPLOY.md` for the walkthrough.

## Key Constraints

1. **Offline-first:** Everything must work without internet (Tube has no signal)
2. **Android Chrome:** Primary target browser; must pass PWA installability checks
3. **Single-file preference:** Keep the app as simple as possible — one HTML file + supporting assets
4. **No backend/server:** Fully client-side; no API calls, no database, no auth
5. **3-week deadline:** Trip starts April 20, 2026 — MVP must be ready before then
