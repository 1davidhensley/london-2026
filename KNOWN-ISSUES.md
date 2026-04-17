# London 2026 Trip App — Known Issues

## Open Issues

### ~~1. Churchill War Rooms Ticket Missing~~
- **Status:** Resolved (April 6, 2026)
- **Details:** David purchased tickets on April 7, 2026. Order ref D7H35XV49 — 2 adult General Admission, £34 each, Apr 25 at 09:00.
- **Fix:** Ticket PDF created and embedded in app. Added `tickets` property to Churchill War Rooms stop data, added PDF to service worker cache (`ASSETS_TO_CACHE`), bumped cache v7→v8.
- **Note:** The embedded PDF is a recreated confirmation (not the original email PDF). David should keep the original booking email on his phone as backup for barcode scanning at entry.

### 2. Day 1 Dinner TBD
- **Status:** Pending decision
- **Details:** Day 1 (Apr 21) dinner is listed as "TBD — Bleeker Burger or Honest Burger"
- **Impact:** Minor — app will show both options until David decides.
- **Action:** David to pick a restaurant before the trip.

## Resolved Issues

### 3. Day Pill Navigation — Wrong Day-of-Week Labels
- **Status:** Fixed (April 6, 2026)
- **Root Cause:** The day pill buttons (sticky nav bar) had incorrect day-of-week abbreviations for April 21–25. They were shifted one day earlier (Mon instead of Tue, Tue instead of Wed, etc.). Days 26–28 were correct.
- **Reported by:** Paula
- **Fix:** Corrected pill labels: Mon→Tue 21, Tue→Wed 22, Wed→Thu 23, Thu→Fri 24, Fri→Sat 25. Days 26-28 were already correct.

### 4. Day Card Content Truncation
- **Status:** Fixed (April 6, 2026)
- **Root Cause:** `.day-card.expanded .day-content` had `max-height: 3000px` with `overflow: hidden`. Days with many stops, transport directions, exhibit checklists, and walk transitions (especially marathon day and Churchill + Soho day) exceeded 3000px, causing content to be cut off.
- **Fix:** Changed `max-height: 3000px` → `max-height: 50000px`. Used a large numeric value instead of `none` to preserve the CSS transition animation on expand/collapse.
- **Prevention:** If new stops or content are added to any day, this value provides ample headroom.

### 4. Editable Packing List Not Updating on Installed PWA
- **Status:** Fixed (March 30, 2026)
- **Root Cause:** Service worker cache not bumped after editable packing list was deployed. Main app was stuck at v5, Mom & Dad app at v1. Installed PWAs were serving the old cached HTML without edit functionality.
- **Symptoms:** Paula reported packing list editing didn't work. The code was correct — the stale service worker cache was preventing the updated HTML from loading.
- **Fix:** Bumped service worker cache version: main app v5→v6, Mom & Dad app v1→v2. This forces the service worker to re-fetch all assets on next load.
- **Prevention:** Always bump the service worker cache version whenever deploying code changes. Added this as a deployment checklist item.

### 5. Travel & Stays Card Rendering Empty After v17 Deploy
- **Status:** Fixed (April 16, 2026, v17 → v18)
- **Root Cause:** `renderTravelCard()` guarded with `if (!grid || !window.travelData) return;`. Top-level `const travelData = {...}` in a classic `<script>` block creates a script-scoped binding — it does NOT attach to `window`. So `window.travelData` was `undefined` and the function exited silently, leaving `#travelGrid` empty.
- **Symptoms:** Paula reported Travel & Stays section was blank on her phone after the v17 deploy went out. Headless-Chromium test against the live URL confirmed same behavior on v17; after the v18 fix the same test passed end-to-end (3 rows rendered, no page errors).
- **Fix:** Swapped `!window.travelData` → `typeof travelData === 'undefined'`. Cache v17 → v18.
- **Prevention (general gotcha):** In classic scripts, only `var` and function declarations attach to `window`. `const`/`let`/`class` at the top level create script-scoped bindings accessible by name, but NOT via `window.name`. If defensive guards reach for `window.foo`, either use `typeof foo` or explicitly write `window.foo = foo`.

### 6. Non-Technical User Couldn't Self-Verify PWA Cache Version
- **Status:** Fixed (April 16, 2026, v18 → v19)
- **Root Cause:** After deploying v17 → v18 to fix the Travel & Stays empty rendering, Paula's phone still showed it blank. Root cause: iOS PWA cache was still on the old version; the live code was correct. But without a way to see the installed cache version on the phone, there was no way for her to diagnose the difference between "app code is broken" vs "my phone just hasn't picked up the new code yet" without asking David.
- **Fix:** Added a self-verifying version label to the footer. Checks the installed cache (`caches.keys()` for highest `london-2026-vN`) and compares to the latest deployed (fetch `./sw.js` and parse `CACHE_NAME`). Shows `App version: v19 ✓` when current, or `Installed: vN · Latest: vM — fully close and reopen the app to update` (in marathon orange) when stale. Graceful fallbacks when offline.
- **Also delivered:** Emailed David and Paula a plain-English update-instructions guide (iOS "fully close" gesture, Safari fallback, remove-and-readd nuclear option).
