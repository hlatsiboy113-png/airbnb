# RTTEST / e2e — End-to-end journey evidence

## What exists

**No E2E test harness exists in the repository** — no Cypress, no Playwright, no
Puppeteer, no `e2e/` folder, no E2E npm scripts. Verified by directory scan and
git history search (the earlier "host-flow E2E 25/25 × 3 runs" recorded in
`RENDER_REDEPLOY.md` has **no committed script or raw output**).

## Current rerunnable journeys

The most important guest journey is fully executable by hand and partially
covered by automated backend tests:

```
Guest login
  -> Search
  -> Location results
  -> Property details
  -> Future dates
  -> Guest count
  -> Reserve
  -> Confirmation feedback
  -> My Reservations
```

| Step | Automated coverage today |
|---|---|
| Guest login valid/invalid | `backend/tests/auth.test.js` (API level) |
| Search / filtered results | `backend/tests/accommodations.test.js` (API level) |
| Property details data | `backend/tests/accommodations.test.js` (get by id) |
| Date/guest validation + server totals + overlap | `backend/tests/reservations.test.js` |
| My Reservations list (per-user scope) | `backend/tests/reservations.test.js` |
| UI-level click-through | **no automated coverage** |

## How to run a manual E2E today

Locally:
1. `cd backend && npm install && npm start` (needs real `MONGO_URI` — see
   `backend/.env.example`; the seed data used by the rubric, incl. the 4 required
   locations × 5 stays, comes from the accommodations seed script).
2. `cd frontend && npm install && npm start` (guest app; `REACT_APP_API_URL`,
   see `frontend/.env.example`).
3. `cd admin-frontend && npm install && npm start` (host/admin app; see
   `admin-frontend/.env.example`).
4. Walk the journey above; follow `RTTEST/evidence/screenshot-checklist.md`.

Against the live deployment (`https://airbnb-guest.onrender.com` +
`https://airbnb-1-e7hp.onrender.com` + `https://airbnb-zq1x.onrender.com/api`)
the same walk is possible without any local setup.

## Outstanding

- An executable E2E script/harness (or at minimum a captured video/screenshots of
  the full journeys) to turn the recorded "host-flow 25/25" claim into live,
  current evidence.
- Screenshots per the checklist are the practical replacement for the missing
  harness.