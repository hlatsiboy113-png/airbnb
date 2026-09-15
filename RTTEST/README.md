# AirStay — RTTEST (Runtime Test & Evidence)

This folder is the single source of truth for AirStay's testing story. It tells
a reviewer exactly: what tests exist and where, which results are **current
verified** vs **historical** vs **outstanding**, what evidence supports each
rubric row, and what still needs to be produced honestly.

> Rule throughout: **nothing is fabricated.** Every claim maps to a real file, a
> real run, or a real deployed URL. Anything unverifiable is labelled as such.

## Headline status (last verified 2026-09-16)

| Check | Result |
|---|---|
| Backend automated tests (`cd backend && npm test`) | **PASS — 72/72 (4 suites)** |
| Guest frontend production build (`CI=true npm run build`) | **PASS** |
| Admin/host frontend production build (`CI=true npm run build`) | **PASS** |
| Login password visibility toggle (guest + host/admin) | **DONE** — build-verified |
| Frontend data-mutation safety (no writes on page load) | **VERIFIED** — GET-only on mount; mutations are user-gesture only |
| Frontend automated tests | **none exist** (exit 1, "No tests found" — recorded, not claimed) |
| E2E harness | **none in repository** — 25/25 host-flow runs are HISTORICAL claims only |
| Live deployment probes (Render) | **PASS** per listed check |

## Navigation

| Area | Portal / index | Raw evidence |
|---|---|---|
| Full inventory (all tests + results + statuses) | [`inventory.md`](inventory.md) | — |
| Backend tests (real, runnable) | [`backend/index.md`](backend/index.md) | [`results/backend-current.txt`](results/backend-current.txt) |
| Authentication & authorization | [`authentication/index.md`](authentication/index.md) | — |
| Accommodation CRUD | [`accommodations/index.md`](accommodations/index.md) | — |
| Reservations | [`reservations/index.md`](reservations/index.md) | — |
| E2E journeys | [`e2e/index.md`](e2e/index.md) | — |
| Frontend verification | [`frontend/index.md`](frontend/index.md) | [`results/builds-current.md`](results/builds-current.md) |
| Regression mapping (journey → coverage) | [`regression/index.md`](regression/index.md) | — |
| Production deployment checks | [`production/index.md`](production/index.md) | [`results/deployment-current.md`](results/deployment-current.md) |
| Historical claims (40/40, 44/44, 51/51, 25/25×3) | [`historical/README.md`](historical/README.md) | [`historical/`](historical/) |
| Results (backend/builds/deployment) | [`results/README.md`](results/README.md) | [`results/`](results/) |
| Rubric → evidence matrix | [`evidence/rubric-evidence-matrix.md`](evidence/rubric-evidence-matrix.md) | — |
| Screenshot register (currently: none found) | [`evidence/screenshot-register.md`](evidence/screenshot-register.md) | — |
| Screenshot capture checklist (what to shoot) | [`evidence/screenshot-checklist.md`](evidence/screenshot-checklist.md) | — |
| Screenshot collection point (empty until captured) | [`evidence/screenshots/README.md`](evidence/screenshots/README.md) | — |
| Final verification report (2026-09-16 phase) | [`evidence/final-verification-report.md`](evidence/final-verification-report.md) | — |

## Layout

```
RTTEST/
├── README.md                    <- this portal
├── inventory.md                 <- complete test + evidence inventory
├── backend/ authentication/ accommodations/ reservations/
│   e2e/ frontend/ regression/ production/      <- area indexes (link to real code/tests)
├── results/                     <- current raw evidence (backend/builds/deployment)
├── historical/                  <- earlier claims, clearly labelled
└── evidence/
    ├── rubric-evidence-matrix.md
    ├── screenshot-checklist.md
    ├── screenshot-register.md
    └── screenshots/             <- guest/ host/ admin/ reservations/ responsive/
                                    authentication/ unclassified/  (empty until captured)
```

## Honest bottom line

Backend behaviour (72/72), both builds, the login visibility toggle, the
data-mutation safety review, and the live deployment guard rails are
**current verified**. There are **no screenshots** and **no E2E harness** in the
repository; the host-flow 25/25 claim is historical and stored as such. Frontend
visual/rubric proof remains **PARTIAL/OUTSTANDING** until real captures exist.