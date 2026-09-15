# RTTEST / results — Current verified results (2026-09-15)

Run in this repository, from a clean `npm install` on Windows (Node.js + npm via
the machine's global install). All commands:

```
cd backend          && npm test
cd ../frontend      && CI=true npm run build          # with REACT_APP_API_URL set
cd ../admin-frontend && CI=true npm run build          # with REACT_APP_API_URL set
cd ../frontend      && CI=true npm test               # result: "No tests found" (expected)
```

## Files

| File | What it contains | Result |
|---|---|---|
| [`backend-current.txt`](backend-current.txt) | Raw Jest output (`npm test` → `jest --runInBand`) | `Test Suites: 4 passed, 4 total · Tests: 51 passed, 51 total · Time: ~13.7 s` |
| [`builds-current.md`](builds-current.md) | Both production builds (guest + admin) | PASS × 2 |
| [`deployment-current.md`](deployment-current.md) | Live Render checks (API + 2 SPAs) | PASS per listed check |

## How to reproduce

```powershell
# backend tests (no DB required — models are mocked)
cd backend
npm test

# guest frontend build (the prebuild guard requires REACT_APP_API_URL)
$env:CI = "true"
$env:REACT_APP_API_URL = "https://airbnb-zq1x.onrender.com/api"   # public API, not a secret
cd ..\frontend
npm run build

# admin frontend build
cd ..\admin-frontend
npm run build

# confirm the frontend test gap (expected: 0 files)
cd ..\frontend
npm test
```