# London 2026 Trip App — Development Roadmap

## MVP Scope (Target: before April 20, 2026)

### Core Features
1. **Full 8-day itinerary** — Expandable day cards (Apr 21–28) with all stops, times, and details
2. **Sticky day navigation** — Pill bar to jump between days
3. **Transport directions** — Step-by-step board/ride/transfer/exit with color-coded icons
4. **Embedded ticket PDFs** — Tower of London, Westminster Abbey, British Museum viewable offline with QR codes
5. **Reservation tags** — Color-coded with who booked and party size
6. **Kensington Garden design** — Fresh spring palette (greens + warm gold on light cream)
7. **PWA installable** — Add to Home Screen on Android Chrome
8. **Full offline support** — Service worker caches everything; works on the Tube
9. **Resources page** — Emergency contacts, medical info, cab apps, venue links, and travel tips

### Not in MVP (Future Ideas)
- Sync between David and Paula's phones
- Google Maps integration for walking directions
- Day-of notifications/reminders
- Weather widget per day
- Spending tracker
- Photo journal per stop
- ~~Churchill War Rooms ticket~~ (purchased and integrated — Session 12)

## Development Phases

### Phase 1: App Shell + Itinerary ✅
- [x] Create index.html with Kensington Garden palette
- [x] Build hero header and day pill navigation
- [x] Implement all 8 day cards with full itinerary data (70+ stops)
- [x] Add transport direction callouts with step icons (Board/Ride/Transfer/Exit/Walk)
- [x] Add reservation and ticket tags

### Phase 2: Tickets + Offline ✅
- [x] Ticket PDFs linked for offline viewing via service worker cache
- [x] Create ticket viewer modal/overlay with iframe
- [x] Build service worker (sw.js) with cache-first strategy
- [x] Create web app manifest (manifest.json) with SVG icons
- [x] PWA installability: manifest + service worker + meta tags

### Phase 3: Resources + Polish ✅
- [x] Removed editing feature (double-tap edit, add/remove stops) — David decided a read-only guide is cleaner
- [x] Added Resources page with emergency/medical info, cab apps, venue contacts, travel tips
- [x] Resources accessible via gold "Resources" pill in nav bar
- [x] Add Churchill War Rooms ticket (purchased April 7, integrated April 6)
- [ ] Final design polish and testing
- [ ] Send to David and Paula for installation

## Session Log

### Session 1 — March 28, 2026
**Decisions made:**
- PWA approach chosen over native Android (fastest path, reuses HTML prototype)
- "Kensington Garden" color palette selected (spring greens + warm gold, light background)
- Ticket embedding strategy: PDFs uploaded by David, will be base64-encoded into app
- Hybrid ticket approach: pre-loaded booking data from Gmail + embedded PDF tickets
- MVP scope locked: 9 features (itinerary, nav, transport, tickets, tags, palette, PWA, offline, editing)

**Tickets collected:**
- Tower of London: 2 adult tickets, QR codes, Apr 22 9:00am (4-page PDF)
- Westminster Abbey: 2 adult tickets, QR code + barcode, Apr 23 9:30am (2-page PDF)
- British Museum: 2 tickets for David Hensley, QR codes, Apr 24 10:00am (2-page PDF)

**Still needed:**
- Churchill War Rooms ticket — not found in David's Gmail, needs follow-up with Paula or purchase

**Files created:**
- palette-preview.html — Color palette comparison (3 options)
- tickets/ — Directory with 3 ticket PDFs
- ARCHITECTURE.md — System architecture and design decisions
- DEVELOPMENT.md — This file
- KNOWN-ISSUES.md — Known issues tracker

### Session 2 — March 28, 2026 (continued)
**Built the complete PWA:**
- index.html (1,670 lines) — Full app with all 8 days, 70+ stops, transport directions, ticket viewer, editing
- sw.js — Service worker with cache-first strategy, pre-caches app shell + ticket PDFs
- manifest.json — PWA manifest with SVG icons, standalone display, portrait orientation

**All MVP features implemented:**
1. ✅ Full 8-day itinerary with expandable day cards
2. ✅ Sticky day pill navigation (scrollable, Day 26 marathon-styled)
3. ✅ Step-by-step transport directions with color-coded icons
4. ✅ Ticket PDF viewer modal (Tower of London, Westminster Abbey, British Museum)
5. ✅ Reservation tags (Paula/David/James with party sizes)
6. ✅ Kensington Garden spring palette
7. ✅ PWA installable (manifest + service worker + meta tags)
8. ✅ Full offline support (service worker caches everything)
9. ✅ Editable itinerary (double-tap to edit, add/remove stops, localStorage persistence)

**Architecture decisions made during build:**
- Used localStorage instead of IndexedDB for simplicity (sufficient for this data size)
- Ticket PDFs linked as separate files cached by service worker (not base64-encoded — cleaner and smaller HTML)
- Data-driven rendering: all itinerary data in JS object, rendered dynamically (makes editing/adding stops clean)
- Churchill War Rooms shows "Tickets Required" placeholder — David confirmed not yet purchased

### Session 3 — March 28, 2026 (continued)
**Design polish based on David's feedback:**
- Restored stronger gold accent colors: stop times now gold (#c07d3e), header title gold, day card numbers gold, transport headers gold with accent underline, gold accent bar under header
- Added 28 walking transition bullets between stops (e.g. "Walk 10 min to Cecil Court") — dashed border-left with 🚶 icon
- Why: The original itinerary PDF had walking directions connecting each point of interest; David wanted these back to help navigate between stops on foot
- Moved transport directions from grouped section at bottom of day cards to inline between stops (matching walking transition placement)
- Why: David wanted the day to read top-to-bottom as a natural flow — walk transitions AND transport directions between the stops they connect, not grouped separately at the bottom
- Removed "See transport" placeholder text from travel stops since directions now show inline

### Session 4 — March 28, 2026 (continued)
**Feature changes based on David's feedback:**
- Removed editing feature (double-tap edit, add/remove stops, delete buttons, localStorage persistence)
- Why: David decided a read-only guide is cleaner for the trip — no risk of accidental edits while navigating
- Removed all editing CSS (.editable, .stop-delete-btn, .add-stop-btn, .stop-details-editable, .stop.editing)
- Removed all editing JS (setupEditableFields, makeEditable, editStop, deleteStop, addStop, loadStoredData, saveStoredData)
- Added Resources page with 8 categories: Emergency & Medical, Transportation, Marathon, Attractions, Food, Shopping, Useful Info
- Resources accessible via gold "Resources" pill in the day navigation bar
- Why: David wanted quick access to venue contacts, emergency numbers, cab apps, and practical travel info — all in one place, available offline
- Bumped service worker cache to v2 to push updated app to installed PWAs

**10 Design Improvements (from design critique):**
1. Floating "back to top" button — appears after 400px scroll, smooth scroll to top
2. Day-of-week names on pills — "Mon 21", "Tue 22" etc. instead of "Day 21", "Day 22"
3. Auto-highlight "Today" — during the trip (Apr 2026), auto-expands today's card with gold highlight ring
4. Collapsible flight bar — auto-collapses on days that aren't arrival/departure; toggle button to show/hide
5. Larger ticket buttons — full-width "View Tickets" buttons replace the small inline "View" text
6. Timeline connector — vertical line with dots connecting stops, gives visual sense of day progression
7. Font fallback — added font-display: swap, system font fallbacks for offline first-load reliability
8. Bigger tap targets — day card headers now min 56px height with touch-action: manipulation
9. "Last updated" footer — shows David & Paula's names and the date the app was last built
10. Dark mode — full dark palette via prefers-color-scheme media query for nighttime use
- Bumped service worker cache to v3

### Session 5 — March 29, 2026
**Deployed to GitHub Pages:**
- Created GitHub repo: https://github.com/1davidhensley/london-2026
- Live URL: https://1davidhensley.github.io/london-2026/
- All files deployed: index.html, sw.js, manifest.json, 3 ticket PDFs

**Deployment method (for future reference):**
- Large files (71KB HTML, 100KB+ PDFs) can't transfer through Desktop Commander's write_file efficiently
- Solution: Get GitHub auth token from David's machine (`gh auth token` via cmd shell), then push directly from Cowork sandbox using git with token auth
- Key gotcha: `gh` and `git` are on PATH in `cmd` but NOT in PowerShell on David's machine — always use `shell: "cmd"` for Desktop Commander
- Enable GitHub Pages via: `gh api repos/<user>/<repo>/pages -X POST -f source[branch]=main -f source[path]=/` (don't use `-f build_type=legacy`)
- Why documented: Took multiple failed attempts (direct write, base64 chunking, PowerShell decode scripts) before finding this approach — saves time on future deploys

**Email draft created for Paula:**
- Subject: "London Trip App — Install It on Your Phone!"
- Includes live URL, Android Chrome install instructions, offline/dark mode notes

### Session 6 — March 29, 2026 (continued)
**4 new features based on end-user testing feedback:**

1. **Google Maps navigation links** — Every walk transition and transport direction now has a tappable 📍 "Navigate" pill that opens Google Maps with the correct destination and travel mode (walking or transit). Why: So David and Paula can tap once and get turn-by-turn directions to their next stop.

2. **Venue links throughout itinerary** — Restaurant, hotel, attraction, pub, and shop names in the itinerary are now tappable links to official websites. Opens in new tab. Why: Quick access to menus, hours, contact info, and booking without leaving the app mindset.

3. **Marathon day rebranded with MJFF orange (#e07800)** — Marathon day card, pill, and stops now use Michael J. Fox Foundation brand orange instead of generic red. Added "Running for Michael J. Fox Foundation" as the first stop on marathon day with a link to David's Team Fox fundraising page. Why: David is running for Team Fox / MJFF and wanted the app to reflect that.

4. **Interactive exhibit checklists** — Tower of London, Westminster Abbey, British Museum, and Churchill War Rooms exhibits are now individual checklist items with touch checkboxes. Checked state persists via localStorage. Checked items get strikethrough styling. Why: Users wanted to track which exhibits they've visited while walking through each venue on mobile.

- Fixed hardcoded marathon color values (#c44536, #d65546) that weren't using CSS variables
- Bumped service worker cache to v4
- Redeployed to GitHub Pages

### Session 7 — March 29, 2026 (continued)
**Mom & Dad Trip Dashboard (MomDadTripDashboard.jsx):**
- Created React mockup for David's parents' trip itinerary (April 18–30)
- Data sourced from "London 2026 Integrated Timeline" Google Sheet (exported as CSV)
- Three trip phases: Bath (Apr 18-20) → Cotswolds (Apr 21-23) → London (Apr 24-30)
- Three navigation views: Day View, Full Trip overview, and Resources tab

**April 25th Birthday celebration for Mom:**
- Custom birthday theme: pink gradient header, confetti animation, special banner
- Birthday-styled day card with cake emoji in date scroller
- "Happy Birthday, Mom!" banner with animated confetti on the day view
- Family events highlighted as "Birthday Family Time" with pink accents
- Why: April 25th is Mom's birthday — the whole family will be together in London celebrating

**Google Maps integration:**
- Every known venue, restaurant, hotel, and attraction links to Google Maps
- Green "Open in Maps" pill buttons on each event card
- Hotel banners include a "Map" link for quick navigation
- U.S. Embassy in Resources also has a "Directions" map link
- Why: Parents need easy tap-to-navigate functionality, especially in an unfamiliar city

**Resources tab added to Mom & Dad dashboard:**
- Emergency & Medical: 999, NHS 111, U.S. Embassy (with map link), Boots Pharmacy, NHS Walk-In
- Getting Around: Uber, Bolt, FREE NOW (black cabs), TfL, Citymapper
- Family Contacts: David & Paula, James & Stef emails, shared hotel info
- Useful Info: country code, contactless payment, power outlets, currency, time zone
- London Marathon: official site, spectator guide (for cheering on David)
- Why: Parents need quick access to emergency numbers and transport options in one place

**Family Contacts added to main London app (index.html):**
- New "Family Contacts" section in Resources page with David & Paula, James & Stef, shared hotel
- Why: All family members should be easily reachable from the main app during the London portion of the trip

**Standalone HTML build & deployment:**
- Converted React JSX mockup to standalone single-file HTML/CSS/JS (same architecture as main app)
- Fixed Unicode escape sequences that rendered as literal text in JSX (wrapped in JS expressions)
- Created PWA files: manifest.json, sw.js with cache-first offline strategy
- Dark mode support via prefers-color-scheme media query
- Auto-selects today's date during the trip (Apr 18–30)
- Deployed to new GitHub repo: https://github.com/1davidhensley/london-2026-mom-dad
- Live URL: https://1davidhensley.github.io/london-2026-mom-dad/
- Separate repo from main app (1davidhensley/london-2026) — parents get their own independent app
- Why: David wanted parents to have their own app that won't interfere with his and Paula's version

**Email sent to Mom (rhensle1@gmail.com):**
- HTML email with install instructions for Android Chrome and iPhone Safari
- Includes direct link to live app, step-by-step "Add to Home Screen" guide
- Teases the birthday surprise on April 25th without spoiling the confetti
- Created as Gmail draft for David to review before sending

### Session 8 — March 29, 2026 (continued)
**Three features added to BOTH apps (David & Paula + Mom & Dad):**

**1. Weather info per day:**
- April average temperatures shown on each day card
- David & Paula app: London averages (15°C/59°F, 35% rain) for all 8 days, marathon day has special weather note
- Mom & Dad app: location-aware weather — Bath (13°C/55°F), Cotswolds (12°C/54°F), London (15°C/59°F) auto-selected based on hotel
- Weather bar renders below hotel/day header with icon, temp, description, rain chance
- Shows in both Day View and Overview modes
- Why: Helps with daily clothing decisions and umbrella planning in changeable April weather. Real forecasts will be swapped in ~10 days before departure

**2. Google Maps buttons on every POI:**
- Mom & Dad app: Already had Maps links on every event from initial build
- David & Paula app: Added `mapsQuery` to 25+ stops that only had walk-transition links — restaurants, hotels, attractions all now have "📍 Open in Maps" buttons directly on the stop card
- Why: One-tap navigation to any venue without having to find the walk transition first

**3. Tailored packing lists:**
- David & Paula app: Marathon-focused (38 items across 5 categories — Travel Essentials, Marathon Gear, Clothing, Toiletries, Tech)
- Mom & Dad app: Road trip + sightseeing focused (33 items across 5 categories — Travel Essentials, Clothing, Toiletries, Road Trip Items, Tech)
- Both use localStorage for checkbox persistence, progress bar, collapsible categories, and reset button
- Why: Different trips need different gear — David needs race shoes and gels, parents need driving license and car rental docs

**Deployment:**
- Mom & Dad app redeployed: https://1davidhensley.github.io/london-2026-mom-dad/
- David & Paula app redeployed: https://1davidhensley.github.io/london-2026/
- Service worker bumped to v5 on main app to push updates to installed PWAs
- Email to James (hensley.james@gmail.com) drafted with link to Mom & Dad's app
- Email to David & Paula drafted with update notes and instructions for refreshing installed PWA

### Session 9 — March 30, 2026
**Editable packing lists (both apps):**
- Packing lists in both apps are now fully customizable — Paula (and Mom & Dad) can tailor them
- Edit mode toggle: "✏️ Edit List" button switches to edit mode with "✓ Done Editing" to exit
- Add items: each category gets an input field with "+" button in edit mode
- Remove items: red "✕" delete button appears on each item in edit mode
- Rename items: tap any item text in edit mode to rename it inline
- Add/remove categories: "Add Category" button at bottom, delete button on category headers
- Full persistence: entire custom list saved to localStorage as JSON (`pack-dp-custom-list` / `pack-mom-custom-list`)
- On load, custom list is used if it exists; otherwise defaults load
- Reset offers two options: "Reset checkboxes" (uncheck all) and "Reset to original list" (restore defaults)
- Why: Paula requested the ability to customize the packing list — the defaults are a starting point, not a final list
- Redeployed both apps to GitHub Pages

### Session 10 — March 30, 2026 (continued)
**Bug fix: Editable packing list not loading on installed PWA**
- Paula reported the packing list editing didn't work on her installed app
- Debugged using structured /engineering:debug approach: Reproduce → Isolate → Diagnose → Fix
- **Root cause:** Service worker cache was NOT bumped when editable packing list was deployed in Session 9. Main app was still at v5 (from Session 8's weather/maps/packing update). Mom & Dad app was at v1 (from initial deploy). Installed PWAs were serving old cached HTML.
- **Code verification:** Ran 30 automated checks across both apps — all HTML structure, CSS classes, JS functions, button wiring, and localStorage keys validated correctly. The code was fine; only the cache was stale.
- **Fix:** Bumped service worker cache: main app v5→v6, Mom & Dad app v1→v2
- **Why:** Service worker cache-first strategy means the browser serves cached files until the service worker itself changes. Bumping the cache name forces the SW to re-download everything.
- **Lesson learned:** ALWAYS bump the service worker version on every deploy. This is now a mandatory deployment step.
- Redeployed both apps to GitHub Pages

**Deployment checklist (for future deploys):**
1. Make code changes
2. Test locally (serve HTML, verify features work)
3. Bump service worker cache version in sw.js
4. Push to GitHub
5. Verify live site loads new version

### Session 11 — April 2, 2026
**Marathon event guide and bib info integrated into app:**

Data sources:
- TCS London Marathon Participant Event Guide PDF (17-page official guide)
- TCS email: "Important: your Participant Event Guide and Start info" (received April 2, 2026)

**1. Updated Running Show / Expo stop (Day 22 — Wednesday):**
- Renamed "Marathon Expo" to "TCS London Marathon Running Show"
- Added bib #60613, QR code + photo ID reminder, detailed Event Pack contents
- Added interactive checklist: show QR, show ID, collect bib/chip/pins, collect kitbag, fill medical info, browse exhibitors
- Why: The expo stop previously had minimal info. David now has his real bib number and needs to remember to bring the QR code email and photo ID to collect his Event Pack.

**2. Rebuilt Marathon Day (Day 26 — Sunday) with full logistics:**
- Added "David's Start Info" stop: Bib #60613, Blue Assembly Area, Wave 10, Blue Start Line, Blackheath station
- Added race-morning checklist: bib pinned, chip attached, medical info, phone charged, kitbag packed
- Added train travel to Blackheath with transport directions (trains at 08:42/08:47/08:53, free travel with bib)
- Added Blue Assembly Area arrival (09:02) with checklist: drop kitbag, toilets, hydrate, head to start
- Added Wave 10 start (10:23) with start line closure warning (11:30)
- Added on-course hydration & aid reference: water stations, Lucozade, gels, Vaseline, toilets by mile
- Added spectator viewing spots: Cutty Sark, Tower Bridge, Canary Wharf, Embankment, The Mall
- Added post-finish checklist: collect medal, retrieve kitbag, meet at lettered Meeting Points, free travel home until 20:00
- Why: Marathon day was a skeleton with just the charity note and viewing spots. Now it's a complete race-day operations guide — everything David needs from waking up to getting home.

**3. Added race prep reminder to Saturday evening (Day 25):**
- New "Race Prep & Early Night" stop at 8:30 pm with checklist
- Pin bib, lay out kit, pack kitbag, charge phone, set alarm, check forecast
- Includes deferral deadline reminder (23:59 Saturday)
- Why: The night before the marathon is critical for preparation. This ensures David doesn't forget anything.

**4. Updated Resources page:**
- Renamed "Marathon Expo" to "Running Show / Expo" with updated detail
- Added QR Code Email link (opens David's Gmail to the specific TCS email with QR code)
- Added David's Start Info summary (bib, assembly, wave, start time, station, arrival time)
- Why: Quick-reference info available in the Resources page without scrolling through Marathon Day

### Session 12 — April 6, 2026
**Bug fix: Day card content truncation**
- Some days (especially marathon day and Churchill + Soho day) had content exceeding the `max-height: 3000px` limit on expanded day cards, causing content to be cut off below the fold
- **Fix:** Changed `.day-card.expanded .day-content { max-height: 3000px }` → `max-height: 50000px`
- Used a large numeric value (not `none`) to preserve the CSS transition animation on expand/collapse
- Why: `overflow: hidden` combined with an insufficient `max-height` silently truncated long days — users couldn't scroll to see all stops

**Churchill War Rooms ticket integrated (Day 25, Apr 25)**
- David purchased tickets: Order ref D7H35XV49, 2 adult General Admission, £34 each, 09:00 entry
- Created ticket PDF (`tickets/churchill-war-rooms.pdf`) from booking confirmation screenshot
- Added `tickets` property to Churchill War Rooms stop data — app now auto-generates "View Churchill War Rooms Tickets" button
- Added PDF to `ASSETS_TO_CACHE` in `sw.js` for offline access
- Bumped service worker cache v7→v8
- Note: Embedded PDF is a recreated confirmation, not the original email. David should keep the original booking email as backup for barcode scanning
- Why: Churchill War Rooms was the last ticketed attraction without embedded tickets — all 4 attractions now have offline-viewable tickets

**Documentation updates:**
- ARCHITECTURE.md: Updated ticket table (Churchill now has `churchill-war-rooms.pdf`), updated file structure
- KNOWN-ISSUES.md: Marked Churchill ticket issue as resolved, added day card truncation as resolved
- DEVELOPMENT.md: This session log

**Live weather auto-fetch from Open-Meteo API:**
- Added `fetchWeather()` function that calls Open-Meteo's free API (no API key needed) on each app load
- Fetches 16-day London forecast: high/low temps, precipitation probability, WMO weather codes
- WMO codes mapped to emoji icons and descriptions (☀️ Clear → ⛈ Thunderstorm)
- Updates weather bars in-place via DOM manipulation (no full re-render — preserves checklist states)
- Falls back to hardcoded April averages when offline or if API fails
- Marathon day (Day 26) preserves the "check morning forecast" note
- Temperature display upgraded: now shows "Hi°C / Hi°F (Low: Lo°C / Lo°F)" instead of just one value
- Why: Trip is 15 days away — real forecasts are becoming available and much more useful than static averages. As the trip gets closer, more days will have real data. During the trip, all 8 days will show actual weather.
- API: api.open-meteo.com — free, no key, no rate limit concerns for personal use, CORS-friendly

**Deployment:**
- Redeployed to GitHub Pages: https://1davidhensley.github.io/london-2026/
- Service worker cache bumped v7→v9

### Session 13 — April 8, 2026
**Birds to Spot — wink feature for both apps**

Both end users (David & Paula and Mom & Dad) are bird-watchers. Added a small location-aware bird-watching companion to both PWAs as a quiet wink: a per-day `🐦 Birds nearby` chip on day cards (collapsed by default) plus a "Birds to Spot" section in Resources with a tappable spotted-checklist and live "X of N spotted" counter.

**Brainstormed and planned under superpowers skills** — spec in `docs/superpowers/specs/2026-04-08-birds-to-spot-design.md`, 18-task plan in `docs/superpowers/plans/2026-04-08-birds-to-spot.md`, executed with the `superpowers:executing-plans` skill across one session.

**Fact-checking pass before implementation.** The initial drafts in the plan included several well-known-but-wrong bird facts. A research pass corrected:
- **Raven count** at the Tower: six (plus spare) → at least seven (actual current population is 8 under the new Ravenmaster).
- **Peregrine stoop speed**: 240 mph → "over 200 mph" (240 is the Guinness record from a captive bird released from a plane; wild birds stoop around 200).
- **Peregrine location**: Canary Wharf framed as a **hunting perch**, not a nest site (they nest on Tate Modern, Battersea, Parliament — the Wharf is only a hunting perch).
- **Marathon peregrine mile**: mile 19 → mile 18 (Canary Wharf actually spans miles 17–19 with ~18 as centre).
- **Peregrine abundance**: "more pairs than the Lake District" softened to "rivalling" (the comparison is genuinely close).
- **Parakeet origin**: *The African Queen* myth reframed as myth rather than asserted — wild parakeets have been recorded in Britain since the 1860s.
- **Mute Swan royal ownership**: "UK" → "England and Wales" (Scotland and NI excluded), added the Vintners' and Dyers' livery companies.
- **Grey Heron heronries**: Regent's Park alone → Regent's + Battersea (both rival each other in size).
- **Kingfisher hunting**: "hovering then plunging" corrected to **perch-and-dive** (hovering is a fallback, not the signature behaviour). Also honestly framed as "a reward, not a promise" for St James's Park sightings.
- **Dipper location**: removed from Bath's Pulteney Weir entirely — dippers need fast upland streams and are absent from the slow lowland Avon through the city. Relocated to the Cotswolds (upper Windrush, brooks around Stroud).
- **Red Kite reintroduction**: "from Spain" → "from Spanish and Swedish stock between 1989 and 1994" (the Chilterns programme used birds from both countries plus Welsh rescued eggs).
- **Pelican feeding time**: hardcoded "2:30pm" adjusted to match the actual itinerary — Day 23 passes St James's at 2:00pm, so the entry now honestly frames feeding time as *just ahead* of the walkthrough, suggesting lingering on the blue bridge.

**David & Paula app (`index.html`):**
- New `birds` const (7 London species) sibling to `dayData`. Each bird tagged with `dayNumbers` for matching.
- Day mapping: Day 22 (Tower) → Raven · Day 23 (Westminster + St James's) → Pelican · Day 25 (Churchill/St James's area) → Kingfisher · Day 26 (Marathon/Canary Wharf) → Peregrine · Day 27 (Kensington Gardens) → Parakeet + Mute Swan · Day 28 (Thames South Bank) → Grey Heron. Days 21 (arrival) and 24 (British Museum/Covent Garden, mostly indoors) intentionally have no chip.
- `.birds-chip` rendered in `renderDayCards()` immediately under each weather bar. `toggleBirdsChip()` handles expand/collapse via class toggle.
- `renderBirdsResources()` + `setupBirdsChecklist()` inject a "🐦 Birds to Spot" resource group into `#resourcesSection` at init. Counter updates live. Persistence: `localStorage['birds-dp-spotted']` = JSON array of bird ids.
- One-time orphan-dayNumbers warning via IIFE at script parse time — fulfils the spec's mitigation against silent failure if a day is ever renumbered.
- Service worker cache bumped **v10 → v11**.

**Mom & Dad app (`mom-dad/index.html`):**
- New `birds` const with **14 species** — two more than the plan's draft list. 2 Bath, 5 Cotswolds, 7 London. Matched by `day.weather.location` (already present on every itinerary day for weather region lookup — no data model change needed).
- **Bath:** Grey Wagtail, Common Kingfisher (bath entry, River Avon framing).
- **Cotswolds:** Red Kite, Skylark, Yellowhammer, Little Owl, Dipper (relocated from Bath — the spec had it on the wrong river).
- **London:** Raven, Great White Pelican, Common Kingfisher (london entry, St James's framing), Peregrine Falcon, Rose-ringed Parakeet, Mute Swan, Grey Heron. Matches the David & Paula list.
- **New species** not in the original spec, added for the longer Bath/Cotswolds leg: Grey Wagtail (replaces dipper as the Pulteney Weir entry — actually present year-round), Yellowhammer (late-April singing peak, Cotswold hedgerows are a last stronghold), Little Owl (drystone walls, sometimes daylight-active).
- **Kingfisher is split into two entries** (`common-kingfisher-bath` and `common-kingfisher-london`) because the `where`/`blurb` fields describe habitat which differs sharply between the River Avon and St James's lake edges. Same species, two copies.
- Chip rendered in `renderDay()` after the weather card. Each day re-renders fresh.
- `renderBirdsResources()` appends a bird group to `#resourcesList` after `renderResources()` populates it — wired into the `switchView('resources')` branch so both calls happen together on every view switch. Persistence: `localStorage['birds-mom-spotted']`.
- CSS uses the app's existing `--accent` / `--accent-dark` / `--accent-light` / `--border` tokens (green palette, which suits the bird theme) rather than hardcoded hex.
- Service worker cache bumped **v2 → v3**.

**Emoji substitution:** Unicode has no pelican emoji. The goose `🪿` (added Unicode 14.0, 2022) is the closest silhouette substitute and was chosen over flamingo `🦩` (wrong colour) and generic `🐦`. The bird-loving users will read the wink.

**Why a wink and not a dominant feature:** The chip is collapsed by default (≈32px tall) and the Resources entry sits below the existing groups, so the feature stays out of the way for the trip's primary navigation needs but pays off the more attention you give it. Each day card shows at most 2 birds (Day 27 in D&P), keeping the chip lean even on the dense Marathon Day.

**Cross-app London bird copy stays in sync.** Any future London bird edit (copy, emoji, where-line) must be applied to **both** `index.html` files per the CLAUDE.md cross-app convention. The `birds-verify.js` script has a `parity` mode that diffs the two files' London bird entries by id/name/emoji/blurb/funFact. As of this session, there are **three** deliberate divergences that should **not** be "fixed":

1. **Pelican funFact** — D&P version ends with "linger on the blue bridge for ten minutes and you might catch the feast" tied to Day 23's 2:00pm St James's walkthrough. M&D drops the timing wink because that app is region-matched (the pelican shows on all 7 London days, not one specific walkthrough).
2. **Kingfisher blurb** — D&P says "Resident here but elusive" (where "here" = Day 25's St James's area). M&D London kingfisher says "Resident in St James's Park but elusive" — explicit location because the bird shows on every London day without day-specific context.
3. **Peregrine blurb** — D&P opens with "Look up at Canary Wharf around mile 18 —" (David's marathon reference). M&D drops "around mile 18" because Mom & Dad aren't running. The rest of the blurb is identical.

Everything else — id, name, emoji, `where` line, remaining blurb/funFact text — should match. Run `node docs/superpowers/birds-verify.js parity` to confirm.

**Offline:** Pure data + text + emoji. Zero new cached assets, zero new network calls. Offline-safe by construction.

**Verification:** Added `docs/superpowers/birds-verify.js` — a node script that extracts the `dayData`/`itinerary` and `birds` arrays from each file and simulates the day→bird matching + integrity checks. Used instead of a browser-driven visual sweep for the programmatic portion. Visual sweep (chip animation, dark mode, Marathon Day layout pressure) still TODO on the user's device before deploy.

**Files touched:**
- `index.html` — birds const, ~115 lines of CSS, chip markup in `renderDayCards()`, `toggleBirdsChip()`, orphan-validator IIFE, bird-Resources renderers, `init()` wiring.
- `mom-dad/index.html` — birds const, ~95 lines of CSS (using `--accent` tokens), chip markup in `renderDay()`, `toggleBirdsChip()`, bird-Resources renderers, `switchView` wiring.
- `sw.js` — cache v10 → v11.
- `mom-dad/sw.js` — cache v2 → v3.
- `ARCHITECTURE.md` — new bullet under UI Layer.
- `DEVELOPMENT.md` — this entry.
- `docs/superpowers/` — spec, plan, and verification script.

---

## 2026-04-15 — Marathon-morning + LHR T3 travel-day timing

**Why:** David flagged two timing risks. (1) Marathon day (Apr 26) said "Charing Cross *or* London Bridge" with three vague train times — he wanted a single, specific recommendation so he's not making decisions on race morning. (2) Return travel day (Apr 28) sent them to Borough Market until 2:00 pm for a 5:45 pm intl DL0021 departure at LHR T3, with no Heathrow routing, no security/lounge time, and no terminal info — real risk of missing the Virgin Atlantic Clubhouse (or the flight) if the taxi hit traffic.

**Marathon day changes (index.html ~2912–2938):**
- "Train to Blackheath" stop rewritten. Station pinned to **Charing Cross** (no Tube transfer from Café Royal, simplest luggage-light walk). Primary train is **7:58 Southeastern Dartford via Greenwich service**, backup 8:08. `transportDir` now includes four explicit steps with timestamps: 7:30 walk → 7:58 board → ride → 8:28 exit Blackheath. Added `mapsQuery: 'Charing Cross Station, London'` so the Maps button goes somewhere useful.
- "Arrive at Blue Assembly Area" moved **9:02 → 8:45** (gives ~100 min pre-Wave-10 at 10:23, vs the old 81 min — meaningful because kitbag-lorry drop closes 30 min pre-wave and toilet queues are notorious). Checklist updated to reference the 10:10 "be in start pen" target explicitly.
- Caveat left in `details`: "Verify live times on the National Rail app the night before — marathon Sunday usually has extra services." Times are Southeastern's standard Sunday pattern but TfL often runs specials on marathon morning; the app shouldn't pretend otherwise.

**Return travel day changes (index.html ~3163–3180):**
- Borough Market window compressed **2h 30m → 75 min** with "leave by 12:45" baked into the copy.
- Removed the vague "2:00 pm Travel back to Hotel Café Royal" stop. Replaced with a 7-stop sequence:
  - 12:45 Return to Hotel (pick up bags from front desk)
  - 1:30 Taxi to LHR T3 (with transportDir, 60–75 min buffer, explicit "Terminal 3 Departures" drop point)
  - 2:45 LHR T3 bag drop + Fast Track security
  - 3:15 Virgin Atlantic Clubhouse (Delta partner lounge at T3, accessed via Delta One / SkyPriority boarding pass)
  - 5:00 Head to gate (T3 gates can be a 10–15 min walk)
  - 5:45 DL0021 departs (kept as-is)
- Final schedule lands them at LHR exactly 3 hr pre-departure — standard for intl Delta One out of LHR — with ~1h 45m of Clubhouse dwell before gate call.

**Confirmed with user before editing:** Charing Cross (walk) over London Bridge (Tube); Taxi/Uber over Heathrow Express or Elizabeth Line (luggage-friendly, door-to-door after a 5-hour sightseeing morning); Virgin Atlantic Clubhouse access via Delta One/SkyPriority; Paula's marathon-day route already handled separately (not edited).

**Files touched:**
- `index.html` — two block edits in `dayData` (marathon day + return travel day). No renderer changes needed; existing `transportDir` / `mapsQuery` / `checklist` patterns cover everything.
- `sw.js` — cache v14 → v15.
- `mom-dad/` — untouched (changes are D&P-specific: David's marathon, David & Paula's flight home).
- `DEVELOPMENT.md` — this entry.

**Offline:** No new cached assets, no new network calls. Offline-safe by construction.

---

### Session 14 — April 15, 2026 — Marathon Day Spectator Plan + TCS-validated Timing

**What:** Replaced the generic "Spectator Viewing Spots" stop on marathon day with a concrete spectator plan showing estimated passing times at Tower Bridge and Victoria Embankment. Paula + David's parents will spectate together at both locations.

**Time estimates** (Wave 10 start 10:23 AM, ~9:09/mi pace for 4hr target):
- Tower Bridge (Mile 12) — David passes ~12:15 PM, arrive by noon
- Victoria Embankment (Mile 24-25) — David passes ~2:05 PM, head over after Tower Bridge
- The Mall / Finish — ~2:25 PM

**Both apps updated:**
- `index.html` — replaced generic spectator stop (~line 2953) with timed spectator plan including ±15 min caveat and TCS app tracking note (bib #60613).
- `mom-dad/index.html` — replaced vague "Morning: cheer on David!" / "Afternoon: Marathon continues" events with three timed spectator stops (Tower Bridge ~12:00 PM, Embankment ~1:45 PM, Finish ~2:25 PM) with Maps links.
- `sw.js` — cache v15 → v16.
- `mom-dad/sw.js` — cache v4 → v5.

**Train timing validated against TCS official guidance.** Cross-checked David's morning transport against the April 2 "Participant Event Guide and Start info" email from TCS. Official guidance for bib #60613 / Wave 10:
- Train arrival at Blackheath: **08:42 / 08:47 / 08:53**
- Arrival time at the Start: **09:02**

Previous plan had the 7:58 Charing Cross → 8:28 Blackheath → 8:45 Assembly, which was ~17 min earlier than TCS recommends. Updated the Marathon Day transport stop to match official guidance:
- Departure: 7:55 from Café Royal (was 7:30)
- Train: 8:18 Charing Cross → 8:42 Blackheath, backups 8:23 / 8:28 (was 7:58 / 8:08)
- Assembly arrival: 9:02 AM (was 8:45)
- Walk from Blackheath to Assembly: ~20 min (was "10 min" — corrected to match TCS's 9-min gap between 8:53 train arrival and 9:02 Start arrival, accounting for slower recommended trains)

Less time standing in cold pre-race, still aligned with David's personal "at the line by 9 AM" target.

---

### Session 15 — April 16, 2026 — Pre-Trip UX Upgrades (D&P app only)

**What:** Three upgrades landed 5 days before departure, surfacing info the app already had and adding logistical details pulled from confirmation emails. Scope: David & Paula app only — `mom-dad/` untouched this round.

**1. "Today" auto-focus + "Now" badge.** On open, if today's date is within Apr 21–28, the matching day card auto-expands and smooth-scrolls into view. A new `.now` class (accent border + "📍 Now" pill) highlights the stop whose `time` is nearest the current clock — most-recent past if one exists, else first upcoming. Re-evaluates every 5 min while the tab is visible, and on `visibilitychange`. All wrapped in `try/catch` so a stop-time parsing quirk can never break rendering. Existing `today-card` class was preserved; this layers on top.

**2. Travel & Stays resource group.** New `✈️ Travel & Stays` collapsible group at the top of the Resources section. Data lives in a new `travelData` constant (pulled from Delta conf JLC9G7 and Hotel Café Royal concierge thread):
- Outbound: DL20 · Mon Apr 20 SEA 9:45 PM → LHR 3:35 PM Tue Apr 21 (Delta One)
- Return: DL21 · Tue Apr 28 LHR 5:40 PM → SEA 7:59 PM (Delta One)
- Hotel: Hotel Café Royal, 68 Regent Street, London W1B 4DY · +44 20 7406 3301 · check-in Apr 21 / out Apr 28 · English breakfast incl · BMW i7 arrival transfer · Akasha Spa access + 10 AM massage booked Mon Apr 27

Tel link on hotel phone, Maps link on hotel address. Flight times differ by ~5 min from the older `.flight-bar` copy at the top — the new card reflects the latest Delta receipt; left the existing flight-bar untouched to avoid scope creep. The user can reconcile later if desired.

**3. Marathon Day "Race Mode" banner.** New `<div id="raceModeBanner">` pinned between the header and flight-bar. Activates only when local date is 2026-04-26 (and not previously dismissed in this session). Shows a 1-second-updating countdown to 10:23 AM Wave 10 start, then flips to "🏃 Race in progress — go go go!" for the first 30 min, then to a passing-time reminder (Tower Bridge 12:15, Embankment 2:05, Finish 2:25). Chip grid reminds: Charing Cross 8:18 train, Blackheath 8:42 arrival, Blue Assembly by 9:02, Start pen by 10:10. Close button stores dismissal in `sessionStorage` (survives reload but not a new day). Uses `var(--marathon-red)` — no hardcoded colors per the Session 6 rule.

**Files touched:**
- `index.html` — added `travelData` constant (before `dayData`); added CSS for `.stop.now`, `.travel-*`, `.race-mode-*` (before print styles); added dark-mode overrides inside existing `@media (prefers-color-scheme: dark)`; added Race Mode banner HTML between `<header>` and `.flight-bar`; added `✈️ Travel & Stays` resource group at the top of the Resources section; added `tripDayForDate`, `parseStopTime`, `updateNowBadge`, `initTodayFocus`, `renderTravelCard`, `initRaceMode` functions; wired all three into `init()`.
- `sw.js` — cache v16 → v17.
- `mom-dad/` — untouched.
- `DEVELOPMENT.md` — this entry.

**Offline:** No new cached assets, no new network calls. All data inline; sessionStorage for race-mode dismissal. Offline-safe by construction.

**Verification plan:** Override `Date` via DevTools to each Apr 21–28 day → confirm correct day auto-expands + `.now` badge appears on exactly one stop whose time is nearest to the overridden clock. Override to 2026-04-26 at 07:00 / 09:30 / 10:22 / 10:30 / 13:00 → confirm countdown accuracy and state transitions. Toggle Offline in DevTools → confirm all three features still render. Hard-reload and verify `london-2026-v17` is active in Application → Service Workers.

**Addendum — DL21 time reconciliation (same session):** Checked external schedules after realizing the itinerary day-6 stop showed `5:45 pm → 8:04 pm` while the Delta Jan 8 2026 flight receipt (post-schedule-change, conf JLC9G7) shows `5:40 pm LHR → 7:59 pm SEA`. flightmapper.net's published schedule for the Mar 28–Oct 23, 2026 window shows a different generic evening DL21 (17:25 GMT dep / 19:45 PDT arr), which diverges from the user's ticketed times — this likely reflects a later public schedule that didn't amend ticketed bookings. No schedule-change emails from Delta post-Jan 8 2026. Trusted the Delta receipt; updated the return-day stop in `dayData` to `5:40 pm → 7:59 pm` to match the Travel & Stays card and the ticket. David should still verify on the Fly Delta app the morning of Apr 28 — if Delta has issued a silent revision, the app will show it.

**Post-deploy fix (v17 → v18):** Travel & Stays rendered empty on Paula's deployed phone even though v17 was serving correctly. Cause: `renderTravelCard()` guarded with `if (!grid || !window.travelData) return;`, but top-level `const travelData = {...}` in a classic `<script>` block creates a **script-scoped** binding — it does NOT attach to `window`. So `window.travelData` was always `undefined` and the function returned early. Worked in local tests only because I'd opened DevTools and never hit that code path cleanly. Fix: `typeof travelData === 'undefined'` check instead (direct reference within the same script is fine; the `typeof` guard is just belt-and-braces). Cache v17 → v18.

**Gotcha to remember:** in classic (non-module) scripts, only `var` declarations and function declarations attach to `window`. `const`, `let`, and `class` at the top level create script-scoped bindings you can reference by name but NOT via `window.name`. Easy trap when adding defensive guards. If you need a window-level global, write `window.foo = foo` explicitly, or use `var`.

**App version label (v18 → v19):** Paula's phone continued showing an empty Travel & Stays on v18, so ran a headless-Chromium test against the live URL to rule out a code bug — test PASSED end-to-end (all 3 rows rendered, `travelData` + `renderTravelCard` both defined, service worker serving v18, zero page errors). Root cause confirmed as stale PWA cache on the phone, not deployed code.

Added a self-verifying version label to the footer (`#versionTag`) that compares the installed cache (from `caches.keys()`, looking for the highest `london-2026-vN`) against the latest deployed version (fetched live from `./sw.js`). Displays:
- `App version: v19 ✓` when installed == latest,
- `Installed: v17 · Latest: v19 — fully close and reopen the app to update` (in `--marathon-red`) when installed < latest,
- Graceful fallbacks when offline or when caches API is unavailable.

Rationale: non-technical users shouldn't have to ping me to know whether their phone picked up the latest code. A footer line makes it one-scroll to self-diagnose. Cache v18 → v19 so the fix itself propagates.

Also emailed David and Paula a plain-English update-instructions guide (draft in David's Gmail, covers the iOS "fully close" gesture for both home-button and Face-ID phones, Safari fallback, and the nuclear remove-and-readd).

---

### Session 16 — April 18, 2026 — Minute-by-minute Marathon Morning (from David's email to Paula)

**What:** Incorporated the finalized minute-by-minute marathon morning plan that David emailed Paula Apr 18 (19:58 local), expanding Day 26 from a coarse "train + assembly + start" outline into a wake-to-wave timeline.

**Changes to Day 26 (`dayData` in `index.html`):**
- **New stop — `6:15 am · ⏰ Pre-Race Morning Routine`.** Checklist pulled verbatim from the email: wake (6:15), hydrate, order room service (6:25 → arrives 7:10), 6:25–6:55 buffer, Red Bull at 6:55 (starts 1-hour bathroom timer), 7:10–7:40 breakfast, dress 7:40–7:55, final bathroom 7:55, leave hotel 8:00. The Red Bull→breakfast→bathroom timing is load-bearing — it puts the caffeine-induced pit-stop BEFORE the train, not on it.
- **Updated `Train to Blackheath` stop.** Times shifted: 7:55 → 8:00 leave hotel, 8:18 → 8:20 Charing Cross, 8:42 → ~8:45 Blackheath. Kept 8:18 Dartford-via-Greenwich and 8:35 Charing Cross documented as backups — still within TCS's 8:42–8:53 arrival window. Removed the "non-stop" claim from the email (unverified for 8:20 — regular Southeastern stops at Waterloo East + London Bridge; marathon extras may run direct). Added a prompt to verify live times on National Rail app Sat night.
- **Reworked `Blue Assembly` stop.** Time label shifted 9:02 → 8:45 to reflect the email's actual flow: 8:45–9:05 walk up + drop kitbag, 9:05–9:50 toilets/stretch/strip layers, ~9:50–10:00 enter pen (closes 10:13). Previous "9:02 arrival" was the TCS target but the email breaks down what happens between arrival and wave start, which is the 45 min where things go sideways if you don't plan.
- **Updated `Race Prep & Early Night` stop (Apr 25, 8:30 pm).** Alarm 7:30 → 6:15, added hotel wake-up call + backup alarm, added "pre-pack race bag" and "book room service for ~6:25 am" to checklist, added "verify 8:20 Charing Cross on National Rail app" check.
- **Updated race-mode banner chips** (top of page): `Charing Cross 8:18 AM` → `8:20 AM`, `Blackheath 8:42` → `8:45`. Tower Bridge ~12:15 PM and Embankment ~2:05 PM chips unchanged (correctly reflect 4hr pace math).

**Deliberately NOT changed:**
- **Spectator passing times.** Email told Paula "mile 13 (~11:15 AM)" but at Wave 10 start 10:23 + 9:09/mi pace, mile 13 is ~12:22 PM. The app's existing Tower Bridge Mile 12 ~12:15 PM and Embankment Mile 24–25 ~2:05 PM are the correct math (Session 14 TCS-validated). Per David's decision, the app keeps the correct times; the email stays as-sent. David should verbally correct Paula before race morning or Paula will be at Tower Bridge ~1 hour early in the cold.
- **`mom-dad/` app.** Email was to Paula only; mom-dad app keeps its Session 14 spectator plan.

**Files touched:**
- `index.html` — three edits in `dayData` Day 26 (new stop, modified train stop, modified assembly stop), one edit to Apr 25 prep stop, one edit to race-mode banner chips.
- `sw.js` — cache `london-2026-v19` → `v20`.
- `mom-dad/` — untouched.
- `DEVELOPMENT.md` — this entry.

**Offline:** No new cached assets, no new network calls. All data inline. Offline-safe by construction.

**Verification:** Parsed `dayData` end-to-end with node to confirm no JS syntax breakage — 8 days, Day 26 now has 11 stops with correct time sequence (— · — · 6:15 am · 8:20 am · 8:45 am · 10:23 am · — · — · — · 4:45 pm · 6:15 pm). Served locally via `python -m http.server`, confirmed v20 SW responds.

**Open item for David to confirm before Sunday:**
1. Does an 8:20 Charing Cross → Blackheath direct service actually exist on marathon Sunday? The email claimed "non-stop" but that's unverified. The 8:18 Dartford-via-Greenwich is confirmed and also hits the TCS window — leaving both documented.
2. Tell Paula the Tower Bridge passing time is ~12:15 PM, not 11:15 AM. Leave the hotel around 11:15 AM, not 10:30.

### Session 17 — April 19, 2026 — Visual refresh: "The Line"

**What:** Ported the approved "Direction 3 · Line" visual system from the design iteration (bundled at `handoff-for-claude-code/direction-3-line-reference.html`) into the live David & Paula app. The itinerary now reads as a single vertical tube line — each day is a station, each stop is a dot on the track. The line is Piccadilly-adjacent blue for normal days; it turns MJFF orange for Race Day. Gold and leaf-green are used sparingly as spring accents.

**Scope:** David & Paula's `index.html` only. `mom-dad/` was intentionally left on the Kensington Garden palette (separate repo, not in scope).

**Preserved (no behaviour change):**
- All `dayData` content — every stop, time, `mapsQuery`, `walkMapsQuery`, `transportDir`, `checklist`, `reservation`, `tickets`, birds, reservation party sizes.
- Every Maps URL builder (`mapsSearch` / `mapsWalk` / `mapsTransit`) — spot-checked: 44 `mapsQuery`s in `dayData` render as 42 `.maps-btn` + 2 `.transit-maps`; all 4 `walkMapsQuery` entries render as `.walk-maps`. Counts match data exactly.
- Service worker logic, offline cache-first strategy, ticket PDF loading (`viewTicket()`), localStorage keys (`london2026-checked`, `pack-dp-*`, `birds-dp-spotted`), weather fetch + Open-Meteo fallback to April averages, birds module, race-mode countdown math (`initRaceMode()`), MJFF orange as `--marathon-red: #e07800` source of truth.
- Click-to-toggle day-card expansion, click-to-filter day pills, auto-expand today, packing list editor, resources accordion, ticket modal, back-to-top button, version tag footer.
- Day-content `max-height: 50000px` animation (KNOWN-ISSUES §4 — do not lower).

**Visual changes (index.html only):**
- New CSS tokens added at top of `:root` (additions, not replacements — old Kensington Garden tokens still available in case anything still references them): `--line-day`, `--line-day-soft`, `--spring-gold`, `--spring-gold-soft`, `--spring-green`, `--spring-green-soft`, `--mjff` (aliases `--marathon-red`), `--mjff-soft`, `--paper`, `--paper-2`, `--ink`, `--ink-2`, `--ink-dim`, `--hairline`, `--hairline-strong`. Full dark-mode counterparts. See ARCHITECTURE.md token table.
- Google Fonts link extended to include **Space Grotesk** (numerals, labels, hero wordmark) and **Work Sans** (body copy). Local `@font-face` fallbacks added for offline first-load parity with DM Sans / Playfair.
- Legacy `<header>` swapped for `<header class="hero">` with wordmark ("London 26."), sub paragraph, and 3-column Depart / Return / Bib meta over a hairline top border. Added `.season-strip` underneath — a single three-segment green/gold/blue bar with "Spring · London" / "Daffodils · Plane trees · Showers" labels.
- Day-nav `.day-pills` restyled as the sticky outline-pill bar with `backdrop-filter: blur(8px)` on a semi-transparent `--paper` background. Active pill uses ink fill; marathon pill uses MJFF orange outline → orange fill when active.
- The big move: each day is now a **station on a vertical tube line**. A single absolutely-positioned `<div class="timeline"></div>` runs the full height of the `<main>` container. Each `.day-card` gets `padding-left: 3.5rem` and a `::before` station-dot overlaying the line (larger orange halo on `.marathon-day`). Inside each card, stops are dots on a thinner sub-line that also turns orange on Race Day.
- Stop times are monospace Space Grotesk pills (blue fill at 10% alpha on normal days; orange on marathon). Maps buttons are gold outline pills; walk transitions are a spring-green inset block with an inline `Walk →` button; transit blocks have a blue left-border and a rounded `Open transit in Maps` pill.
- Race Mode countdown block now renders inline inside Day 26's card (not as a separate top-of-page banner). Orange border, gradient background, radial blur corner, "Live Countdown" eyebrow, 6 chip grid for Charing Cross / Blackheath / Blue Assembly / Start pen / Tower Bridge / Embankment. IDs `#raceModeBanner` / `#raceModeCountdown` / `#raceModeSubtitle` / `#raceModeClose` preserved so `initRaceMode()` still wires without JS changes. Old top-of-body `.race-mode-banner` element removed; legacy `.flight-bar` hidden (flight details already live in Travel & Stays).
- "Start line" MJFF highlight tag rendered on the 10:23 AM RACE START stop (detected in the renderer via `/wave\s*10\s*start/i.test(stop.name)`, no `dayData` change).
- New styles are scoped under `body.the-line` so legacy rules don't leak into unrelated sections (Resources, Packing, Modal, Footer).

**Renderer (`renderDayCards()`):**
- Rewrote inner template. Class names kept (`.day-card`, `.day-card-header`, `.day-content`, `.stop-list`, `.stop`, `.timeline-dot`, `.stop-time`, `.stop-header`, `.stop-emoji`, `.stop-name`, `.stop-details`, `.stop-checklist`, `.tags`, `.tag`, `.walk-transition`, `.inline-transport`, `.ticket-btn-large`, `.weather-bar`, `.birds-chip`) so all existing event listeners, CSS, and JS queries keep working.
- Added `.marathon-day` class on Day 26's `.day-card` (in addition to the existing `.marathon`) — new CSS targets `.marathon-day`, old CSS still targets `.marathon`, so nothing downstream breaks.
- `<header class="day-card-header">` was changed to `<div class="day-card-header">` to dodge the legacy tag-scoped `header { ... }` CSS (which was adding `text-align: center`, a gold `::after` stripe, and padding). This is purely a tag swap — the class name and event wiring are unchanged.
- New structural elements per card: `.day-head-left` / `.day-num-row` / `.day-weekday` (e.g. "TUE · STATION 1"). Theme string is split on the first grapheme (emoji) and the rest, so the emoji gets its own `.em` span for consistent spacing.
- Marathon day's `.racemode` block is rendered as the first child of `.day-content` when `day.isMarathon`.
- Small renderer-only fix: when today is in April 2026 but before the trip starts (e.g. Apr 19), Day 21 now auto-expands. Previously the `!todayDay` check in the original renderer failed in that window because `todayDay` was a valid number (19) not null, so nothing expanded. Replaced with `!todayInTrip` (derived from `dayData.some(d => d.number === todayDay)`), which preserves the original intent (auto-expand today if in range, else fall back to Day 21).

**Cache bump:** `sw.js` `CACHE_NAME` `london-2026-v20` → `v22` (v21 was an intermediate during testing; shipped v22 includes the weather + copy tweaks below). `ASSETS_TO_CACHE` Google Fonts URL updated to include Space Grotesk + Work Sans alongside DM Sans + Playfair so the first offline load has all font families.

**Weather + copy tweaks (post-review, same session):**
- **Fahrenheit-only weather.** David doesn't use Celsius, so the weather pill now shows hi/lo in Fahrenheit only. `fetchWeather()` writes `${hiF}°F / ${loF}°F` (was `${hi}°C / ${hiF}°F (Low: ${lo}°C / ${loF}°F)`). All 8 `day.weather.temp` fallbacks in `dayData` updated from `'15°C / 59°F'` → `'59°F'`.
- **Rain suffix trimmed.** Pill was wrapping to two lines on 375px mobile because the "rain" word in `"35% rain"` pushed the line over. Now just `"35%"`. Day 26's suffix simplified from `'35% rain — Marathon weather: check morning forecast'` → `'35% — check morning forecast'`.
- **Description moved to `title` attribute.** The `Partly cloudy` / `Overcast` descriptor was the longest item in the pill; it now lives on the `<div class="weather-bar" title="…">` (hover / screen reader) instead of the visible layout. Pill reads `🌥️ TEMP 57°F / 45°F RAIN 12%` on one line.
- **Nowrap on weather values.** Added `white-space: nowrap` to `.weather-value` + `.weather-item` so `57°F / 45°F` doesn't break mid-value.
- **Hero sub copy.** Changed from `"Eight stations on one line, Seattle to Seattle. Wave 10 on Sunday somewhere near the middle."` to `"Eight days between Heathrow and home, with Wave 10 somewhere near the middle."` — closer to the reference's framing, less cutesy.
- **Cache re-bumped to `v22`** for this second pass. Paula will need to fully close + reopen the app after deploy to pick it up.

**Files touched:**
- `index.html` — tokens, dark-mode tokens, fonts link + `@font-face`, `<header>` replacement, removed top-of-body race banner, new `body.the-line` CSS block (~560 lines), `renderDayCards()` rewrite, tiny expansion-logic fix.
- `sw.js` — cache v20 → v21, fonts URL extended.
- `mom-dad/` — **untouched** (still Kensington Garden).
- `handoff-for-claude-code/` — new folder with `HANDOFF.md`, `README.md`, `direction-3-line-reference.html`, `trip-data-preview.js`. Reference material; not loaded by the app.
- `ARCHITECTURE.md` — token table extended with "The Line" section.
- `DEVELOPMENT.md` — this entry.

**Verification in the live preview:**
1. Light mode — blue line, gold Maps pills, green weather pill all clearly readable.
2. Dark mode — line flips to cornflower blue (#6f9bff), MJFF orange glows on Day 26 station dot.
3. Day 26 — station dot orange with 6px soft halo, `.day-number` "26" is orange, `.racemode` renders inside Day 26's content area with live countdown wiring, stops sub-line is orange, "START LINE" tag appears on the 10:23 AM stop.
4. Maps URL counts verified in-browser against `dayData`: 42 `.maps-btn` + 2 `.transit-maps` = 44 (matches 44 `mapsQuery` entries); 4 `.walk-maps` (matches 4 `walkMapsQuery`); 29 `.walk-transition` (matches 29 `walkTo`); 4 `.ticket-btn-large`; 7 `.tag.res`; 87 `.stop` + 87 `.timeline-dot`; 1 `.racemode`; 1 `.tag.hl`.
5. Ticket modal — clicking "View Tower of London Tickets" opens modal with `tickets/tower-of-london.pdf` in the iframe; close button dismisses.
6. Checklist — toggling a stop checkbox persists to `localStorage['london2026-checked']` as `d22-s2-0: true` (etc.); survives reload.
7. Pill filter — clicking `Sun 26` hides all other cards and expands Day 26 with orange pill in active state; clicking "All Days" restores the full timeline.
8. Click-to-toggle on day-card header toggles `.expanded` class.

**Not verified in preview (requires real device):**
- Offline DevTools simulation
- PWA "Add to Home Screen" on Paula's phone
- iOS Safari rendering of `backdrop-filter` on the sticky pill bar

**Open items:**
- If anything in the Kensington Garden palette is visually referenced elsewhere (haven't found any — Resources/Packing/Modal still work) the old `--bg / --card / --primary / --accent / ...` tokens remain defined for backwards compatibility. Can be dead-code swept after a successful David+Paula install.
- `mom-dad/` app not updated — per handoff, the visual refresh is D&P-only. If David wants the Line treatment for his parents' app later, that's a separate effort.
