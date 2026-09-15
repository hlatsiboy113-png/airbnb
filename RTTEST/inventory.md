# AirStay — Test & Evidence Inventory

This inventory records every testing artefact and result that currently exists in
the repository. It distinguishes what is **current verified** (rerun in this
environment on 2026-09-15 and 2026-09-16), **historical** (documented claim
without a live, rerunnable harness today), and **outstanding/unverified** (no
evidence yet).

Legend for the **Result status** column:

- **CURRENT VERIFIED** — rerun and passed/tested in this environment on
  2026-09-15/2026-09-16.
- **HISTORICAL** — recorded in the repository/git history; produced earlier, not
  reproducible today without extra tooling.
- **OUTSTANDING** — no test or evidence exists yet.

---

## 1. Backend automated tests (Jest + Supertest)

Framework: `backend/package.json` → `"test": "jest --runInBand"`.
All tests mock the Mongoose models, so they run without a database. The secret
used by the suite is set in `backend/tests/setup-env.js` (`JWT_SECRET`) — a
test-only value.

| Test file | Location | Type | # tests | Purpose | Related functionality | Result |
|---|---|---|---|---|---|---|
| `auth.test.js` | `backend/tests/auth.test.js` | API / unit (mocked) | 16 | Login (missing fields 400, unknown email 401, wrong password 401, success + JWT round-trip 200, wrong sign-in role 403), registration (incomplete 400, duplicate email 409, guest 201, host 201, admin coercion never promoted 201-with-user-role), `/users/me` (no token 401, invalid token 401, valid token 200, expired token 401), `/users/seed` (blocked 404 in production, available 201 in test) | Authentication, JWT, role enforcement, admin-account protection | CURRENT VERIFIED (16/16) |
| `accommodations.test.js` | `backend/tests/accommodations.test.js` | API / unit (mocked) | 10 | GET list, regex-safe location filter, guest-count filter, GET by id (404 missing, 400 malformed ObjectId, 200 success), POST gating (401 unauthenticated, 403 logged-in guest, 201 host create) | Accommodation CRUD, auth/authorization, validation | CURRENT VERIFIED (10/10) |
| `reservations.test.js` | `backend/tests/reservations.test.js` | API / unit (mocked) | 22 | POST create (401, over-capacity 400, bad dates 400, correct server-side total 201, overlap 400, non-overlap 201, past check-in 400), DELETE (403 non-owner, 200 owner), GET user (scoped 200, empty 200), PUT (200 owner, 403 non-owner, 400 past check-in, 400 overlap), GET host (403 guest, host-scoped query, q filtering, empty result, all), host stats (200, 403 guest) | Reservations, costing, overlap detection, ownership | CURRENT VERIFIED (22/22) |
| `health.test.js` | `backend/tests/health.test.js` | API | 3 | GET /health 200, unknown route 404 JSON, root 404 | app.js wiring, error handler | CURRENT VERIFIED (3/3) |
| `setup-env.js` | `backend/tests/setup-env.js` | config | — | Sets `NODE_ENV=test` and a test-only `JWT_SECRET` | Test bootstrap | n/a |

**Backend suite total: 51/51 passing, 4 suites — CURRENT VERIFIED.**
Evidence: `RTTEST/results/backend-current.txt` (raw Jest output, rerun
2026-09-15 and 2026-09-16).

## 2. Frontend builds

| Check | Command | Result | Evidence | Status |
|---|---|---|---|---|
| Guest frontend production build | `cd frontend && CI=true npm run build` (requires `REACT_APP_API_URL`) | PASS — `main.1ce4bf69.js` (gzip 82.29 kB) | `RTTEST/results/builds-current.md` | CURRENT VERIFIED (2026-09-15 & 2026-09-16) |
| Admin/host frontend production build | `cd admin-frontend && CI=true npm run build` (requires `REACT_APP_API_URL`) | PASS — `main.522db9c2.js` (gzip 83.49 kB) | `RTTEST/results/builds-current.md` | CURRENT VERIFIED (2026-09-16) |

## 3. Frontend automated tests

| Check | Command | Result | Status |
|---|---|---|---|
| Guest frontend unit tests | `cd frontend && CI=true npm test` | **No tests found — exit code 1** (`0 matches` for `src/**/*.(spec|test).{js,jsx,ts,tsx}`) | OUTSTANDING — no automated frontend tests exist |
| Admin/host frontend unit tests | `cd admin-frontend && CI=true npm test` | **No tests found — exit code 1** | OUTSTANDING — no automated frontend tests exist |

Frontend verification is therefore **manual/visual** at present (see
`RTTEST/frontend/index.md` and `RTTEST/evidence/screenshot-checklist.md`).

## 4. E2E tests

| Evidence | Location | Result | Status |
|---|---|---|---|
| Host-flow E2E harness (Playwright/Cypress/Puppeteer) | — | **No E2E test harness exists anywhere in the repository** | OUTSTANDING |
| "Host-flow E2E vs live Atlas data shape: 25/25 PASS (3 consecutive runs)" | `RENDER_REDEPLOY.md` | Claim recorded (3 runs); no raw output, screenshots, or script committed | HISTORICAL — NOT CURRENTLY REVERIFIED |

An assessor can reproduce a host-flow journey manually through the live or local
apps; the steps are in `RTTEST/e2e/index.md`.

## 5. Historical results recovered from the repository / git history

| Claim | Source | Date context | # | Status |
|---|---|---|---|---|
| Backend tests 40/40 PASS | `DEPLOYMENT_QA_REPORT.md` ("Step 8 — Build & Test Verification", "Final Report") | committed 2026-09-04 | 40 suites-pass | HISTORICAL |
| Backend suite 44/44 PASS | committed `RENDER_REDEPLOY.md` (git `HEAD` version) | committed 2026-09-05 | 44 passing | HISTORICAL |
| Backend suite 51/51 PASS | current `RENDER_REDEPLOY.md` (working tree) | 2026-09-05 claim | 51 passing | HISTORICAL claim, **superseded by CURRENT VERIFIED rerun** (2026-09-15 → 51/51) |
| Host-flow E2E 25/25 PASS × 3 runs | current `RENDER_REDEPLOY.md` (working tree) | 2026-09-05 claim | 25/25 | HISTORICAL — no rerunnable harness/artefact |
| Deleted test patch `0003-test-backend-add-mocked-Jest-Supertest-suite.patch` (6831 lines) | git history — commit `25754831` added it; commit `3eeb5be` deleted it | 2026-09-01 → 2026-09-04 | — | HISTORICAL (contents superseded by live `backend/tests/*`) |
| Phase 1 & 2 manual testing guide | `testing/PHASE1_TESTING_GUIDE.md` | Phase 1/2 | — | HISTORICAL manual guidance (checklist; not an automated suite) |

Detailed write-ups: `RTTEST/historical/`.

## 6. Production / live deployment checks (2026-09-15)

| Check | URL | Result |
|---|---|---|
| API health | `https://airbnb-zq1x.onrender.com/health` | 200 `{"status":"success",...}` |
| Public accommodation list | `https://airbnb-zq1x.onrender.com/api/accommodations` | 200, `count: 27` |
| Unknown-email login | POST `/api/users/login` (synthetic email) | 401 |
| Missing credential login | POST `/api/users/login` (email only) | 400 |
| `/users/me` unauthenticated | GET with no token | 401 |
| `/reservations/host` unauthenticated | GET with no token | 401 |
| Accommodation create unauthenticated | POST `/api/accommodations` with no token | 401 |
| Production `/users/seed` | POST | 404 (blocked) |
| CORS allow-list | GET `/api/accommodations` from `Origin: https://airbnb-guest.onrender.com` | 200, `Access-Control-Allow-Origin: https://airbnb-guest.onrender.com` |
| Guest SPA deep link | `https://airbnb-guest.onrender.com/login` | 200 (HTML, bundle `main.cc838128.js`) |
| Guest SPA listing deep link | `https://airbnb-guest.onrender.com/listing/<id>` | 200 (HTML) |
| Admin SPA deep link | `https://airbnb-1-e7hp.onrender.com/host/dashboard` | 200 (HTML) |
| Admin SPA login | `https://airbnb-1-e7hp.onrender.com/admin/login` | 200 (HTML) |

Evidence: `RTTEST/results/deployment-current.md`.

## 7. Outstanding evidence (currently missing)

1. **E2E harness + a current E2E pass** — the 25/25 host-flow runs are historical
   claims with no committed output or script.
2. **Frontend automated tests** — none exist (`react-scripts test` finds 0 files).
3. **Visual/interaction evidence** — no screenshots or recorded walkthrough exist
   in the repository (verified by full-file search 2026-09-16). Capture per
   `RTTEST/evidence/screenshot-checklist.md`, register in
   `RTTEST/evidence/screenshot-register.md`.
4. **Authenticated live-API CRUD evidence** — the live checks above prove the
   auth/role guard rails; a full authenticated create/update/delete reservation
   and listing pass against production data is not present as committed output.
5. **Coverage report** — no Jest coverage configuration or coverage artifact.

## 8. Related documentation (not tests, but referenced by this inventory)

| File | Role |
|---|---|
| `README.md` | Root project documentation (rewritten 2026-09-15) |
| `RENDER_REDEPLOY.md` | Production redeploy checklist + historical claims |
| `DEPLOYMENT_QA_REPORT.md` | Deployment preparation + 40/40 historical result |
| `testing/PHASE1_TESTING_GUIDE.md` | Historical manual Phase 1/2 test guide |
| `PRODUCT_EXPERIENCE.md`, `design_reference_notes.md`, `100-percent-rubric-prompt.md` | Design/rubric context |