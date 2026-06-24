# FITT — your live coaching dashboard

FITT (Frequency · Intensity · Time · Type) is the self-updating version of your race
workpaper. It pulls your runs straight from Tredict, recomputes the analysis, and
redraws the charts every time you open it. Until you wire in your token it shows the
saved 24 Jun snapshot, so it's never blank.

This is also **lesson one of your code track** — a real app you own, deploy, and can change forever.

---

## How it works (30-second tour)

```
  Your phone/browser ──▶ index.html  (the dashboard you see)
                              │  fetch('/api/tredict')
                              ▼
                        api/tredict.js  (runs on Vercel's server)
                              │  adds your secret token
                              ▼
                          Tredict API   (your data)
```

The token lives **only** on the server. It is never sent to the browser, never in the
code, never in git. The Tredict endpoint is already pre-filled in `api/tredict.js`, so
the only secret you provide is your token.

---

## Setup — about 15 minutes, one time

### 1. Create your Tredict token
- In the Tredict **app** (not the docs page): **Settings → Personal API / MCP**.
- Create a new **Personal access token**. Give it **read** scope (`activityRead`).
- Copy the token to somewhere private for a few minutes (a notes app) — **not** into any
  file here and never into a chat. You'll paste it into Vercel in step 4.

### 2. Put this folder on GitHub
- Create a new repo (e.g. `fitt`) at github.com → New repository.
- Upload these files. The easiest way: on the repo's page click **Add file → Upload
  files**, then drag the whole `fitt` folder in. Keep the `api/` subfolder intact — that
  folder is what makes the live data work.

### 3. Deploy on Vercel (free)
- Go to vercel.com → sign in with GitHub → **Add New → Project** → pick your repo → **Deploy**.
- It builds in ~30 seconds and gives you a URL like `fitt.vercel.app`.

### 4. Add your token
- In the Vercel project: **Settings → Environment Variables**. Add:
  | Name | Value |
  |------|-------|
  | `TREDICT_TOKEN` | the token from step 1 |
- Then **Deployments → ⋯ → Redeploy** so the token takes effect.
  *(Optional: `TREDICT_ACTIVITIES_URL` only if you ever want to change which data it pulls.)*

### 5. Open it — the status dot turns green
- Visit your URL. Top-left dot: **amber** = snapshot, **green** = live from Tredict.
- On your phone: **Share → Add to Home Screen**. It installs with the FITT icon and
  opens fullscreen, like an app. No app store, no fee.

---

## If the dot stays amber

The app quietly falls back to the snapshot if the live fetch fails. To diagnose, open
`your-url.vercel.app/api/tredict` directly in your browser:
- `not_configured` → the token env var is missing, or you didn't redeploy after adding it.
- `tredict_error status 401/403` → token wrong, expired, or lacks the `activityRead` scope.
- A wall of JSON → it's working. If charts still don't move, paste me that JSON and I'll
  adjust the `norm()` function in `index.html` — a 2-minute fix.

Note: Tredict personal tokens are valid for a period and then need refreshing — if the dot
goes amber weeks later, regenerate the token in Tredict and update it in Vercel.

---

## Changing it later

It's your code. Come back any time — "add a strength panel", "show HRV", "change the
plan after Week 7" — point me at the repo, I edit, you redeploy. The plan (Protocol) and
the conclusion (Analysis) are plain HTML in `index.html`; the charts are driven by your live data.

## Files
- `index.html` — the whole dashboard (UI + charts + data parsing).
- `api/tredict.js` — the server-side proxy that holds your token (endpoint pre-filled).
- `manifest.webmanifest`, `sw.js`, `icon.svg` — make it installable as a home-screen app.
