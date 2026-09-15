# RTTEST / results — Frontend builds (current)

Both React applications build cleanly in production mode. Each `build/` artifact
is safe to host on any static server (Render static site, Vercel, nginx).

## Run 2026-09-16 (this consolidation pass — CURRENT VERIFIED)

Commands (identical shape for both apps; the `prebuild` guard refuses to build
without `REACT_APP_API_URL`):

```powershell
$env:CI = "true"
$env:REACT_APP_API_URL = "https://airbnb-zq1x.onrender.com/api"
npm run build          # run in frontend/ then admin-frontend/
```

Output for both: `Compiled successfully.`

| App | JS bundle (gzip) | CSS bundle | Result |
|---|---|---|---|
| Guest (`frontend/`) | `build/static/js/main.1ce4bf69.js` (82.29 kB) | `build/static/css/main.a8e709af.css` (7.09 kB) | PASS |
| Admin/host (`admin-frontend/`) | `build/static/js/main.522db9c2.js` (83.49 kB) | `build/static/css/main.c66034db.css` (7.53 kB) | PASS |

Note on the admin hash: on 2026-09-15 a build with `REACT_APP_PUBLIC_URL` also
set produced `main.c9f3967a.js`; today without it the bundle was
`main.522db9c2.js`. Both compiled successfully — quoted env values are inlined
into the bundle, so changing them changes the content hash. The guest JS hash
(`main.1ce4bf69.js`) was identical on both days.

The **deployed** bundles on Render (2026-09-15 check) were guest
`main.cc838128.js` and admin `main.d0b960c0.js` — older builds than these fresh
ones; redeploying would ship these newer bundles (an operational action, not a
code fix).

## How to reproduce

```powershell
cd frontend
$env:CI = "true"
$env:REACT_APP_API_URL = "https://airbnb-zq1x.onrender.com/api"
npm run build

cd ..\admin-frontend
npm run build      # same two env vars
```

## Frontend automated unit tests

| App | Command | Result |
|---|---|---|
| Guest | `cd frontend && CI=true npm test` | **No tests found — exit code 1** (`0 matches`) |
| Admin/host | `cd admin-frontend && CI=true npm test` | **No tests found — exit code 1** |

**Explicit statement: no frontend automated test suite currently exists.**