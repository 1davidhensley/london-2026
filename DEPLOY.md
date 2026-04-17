# Deploying to the Phones

Plain-English guide to pushing changes live so the PWA on David and Paula's phones updates. Written for non-technical use — follow the steps top to bottom.

## How it works (30-second version)

- You edit the files in this folder: `C:\Users\hensl\OneDrive\Documents\Claude\Projects\London Trip App` (or let Claude edit them).
- This folder is **the editing copy** — it does not have a working git remote, so changes here don't go to GitHub on their own.
- The **deploy copy** lives at: `C:\Users\hensl\repos\london-2026`. This copy *is* connected to GitHub (`1davidhensley/london-2026`).
- To deploy: copy the changed files from the editing copy into the deploy copy, commit, and push. GitHub Pages then rebuilds and the phones pick up the new version the next time the PWA reloads.
- The `mom-dad/` subfolder has its own separate GitHub repo (`1davidhensley/london-2026-mom-dad`) with its own deploy copy — if you ever need one, mirror this setup at `C:\Users\hensl\repos\london-2026-mom-dad`.

## One-time setup (already done 2026-04-16)

A proper git clone has been created at `C:\Users\hensl\repos\london-2026` and is logged in via `gh` as `1davidhensley`. You should not need to touch this again unless the folder gets deleted.

If you ever need to recreate it, open **Command Prompt** (not PowerShell) and run:

```cmd
mkdir C:\Users\hensl\repos
cd C:\Users\hensl\repos
git clone https://github.com/1davidhensley/london-2026.git
```

## Deploying a change (the usual flow)

Every time you want changes live on the phones:

### 1. Make sure the cache version was bumped

Open `sw.js` in this folder. Near the top, find:

```js
const CACHE_NAME = 'london-2026-v17';
```

The number must go up by 1 every time you change `index.html`, `sw.js`, or anything in `ASSETS_TO_CACHE`. Without a bump, **phones will keep showing the old version** — this is the single biggest source of "Paula says it's not working" bugs.

### 2. Copy the changed files into the deploy copy

Open **Command Prompt** (search "cmd" in the Start menu — not PowerShell) and paste this block. Adjust the file list if you only changed some of them:

```cmd
set SRC=C:\Users\hensl\OneDrive\Documents\Claude\Projects\London Trip App
set DST=C:\Users\hensl\repos\london-2026
copy /Y "%SRC%\index.html" "%DST%\index.html"
copy /Y "%SRC%\sw.js" "%DST%\sw.js"
copy /Y "%SRC%\DEVELOPMENT.md" "%DST%\DEVELOPMENT.md"
copy /Y "%SRC%\KNOWN-ISSUES.md" "%DST%\KNOWN-ISSUES.md"
copy /Y "%SRC%\ARCHITECTURE.md" "%DST%\ARCHITECTURE.md"
copy /Y "%SRC%\DEPLOY.md" "%DST%\DEPLOY.md"
copy /Y "%SRC%\CLAUDE.md" "%DST%\CLAUDE.md"
```

New ticket PDFs: also copy them into `%DST%\tickets\`.

### 3. Commit and push

In the same Command Prompt window:

```cmd
cd C:\Users\hensl\repos\london-2026
git add -A
git status
git commit -m "Brief description of what changed"
git push
```

- `git status` shows what's about to be committed — sanity-check the list.
- The commit message should be a short sentence like `"Session 15: today auto-focus, Travel & Stays card, marathon race mode"`.
- `git push` will prompt for credentials the first time — use your GitHub username and a **personal access token** (get one by running `gh auth token` in the same Command Prompt and pasting the output as the password).

### 4. Verify it's live

- Wait 30–60 seconds for GitHub Pages to rebuild.
- Open https://1davidhensley.github.io/london-2026/ in a browser.
- Hard-reload (Ctrl + Shift + R) and confirm the new feature appears.
- On the phone PWA, fully close and reopen the app. The service worker should fetch the new version automatically within a few seconds. If it doesn't, in Safari/Chrome on the phone you can also hit the web URL directly and hard-reload once — the installed PWA will then update.

## Mirror to the mom-dad app?

If the change applies to David's parents' app too, repeat the same steps against `mom-dad/`:

- Edit files in `...\London Trip App\mom-dad\`.
- Bump `CACHE_NAME` in `mom-dad/sw.js` (the `mom-dad-london-vN` one — separate from the main one).
- Deploy clone would live at `C:\Users\hensl\repos\london-2026-mom-dad` (not set up yet — create it the same way as step 1 if/when needed).
- Its GitHub repo is `1davidhensley/london-2026-mom-dad`.

## Troubleshooting

**"git push" says authentication failed.** Run `gh auth token` in Command Prompt, copy the output, and paste it as the password. If `gh` itself says you're not logged in, run `gh auth login` and follow the prompts (choose GitHub.com → HTTPS → Yes authenticate Git → paste token or login via browser).

**The phone still shows the old version after deploying.** Did the cache version bump? Open `sw.js` at https://1davidhensley.github.io/london-2026/sw.js and check the `CACHE_NAME` — if it matches the new number, the deploy worked; the phone just needs to fully close and reopen the app. If it still shows the old number, GitHub Pages may still be rebuilding — wait 2 more minutes.

**Command Prompt vs PowerShell.** `gh auth token` and the copy commands behave differently in PowerShell. Always use plain Command Prompt (cmd.exe) for this workflow.

**I edited the wrong copy.** The editing copy is in OneDrive. The deploy copy in `C:\Users\hensl\repos\london-2026` should be treated as disposable — if it ever gets out of sync, delete it and re-clone per the one-time-setup section. Never edit files directly in the deploy copy; always edit in OneDrive and copy over.
