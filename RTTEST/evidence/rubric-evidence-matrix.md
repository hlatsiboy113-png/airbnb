# RTTEST / evidence — Rubric → evidence matrix

Statuses: **PASS** (verified by automated test and/or live probe) ·
**PARTIAL** (implemented & code/build verified, but visual/interaction proof or
an automated test still missing) · **OUTSTANDING** (no evidence at all yet) ·
**HISTORICAL** (previously claimed, not independently reverified).

> Screenshot evidence: **none currently exists** (see
> [`screenshot-register.md`](screenshot-register.md)). No Evidence IDs are yet
> assigned, therefore every row below that needs visual proof is PARTIAL or
> OUTSTANDING regardless of how solid the code is.

Target totals: **Admin Dashboard 100 · Frontend Clone 140 · Node.js Backend 150**.

---

## Area 1 — Admin Dashboard (100)

| Requirement | Implementation | Automated verification | Screenshot evidence | Evidence ID | Status | Notes |
|---|---|---|---|---|---|---|
| Role gate for admin/host functions | `backend/middleware/auth.js` `requireHost`/`requireAdmin`; admin `App.js` routes | `auth.test.js` wrong-role 403; live no-token 401 probes | none | — | PASS | Also live `/api/reservations/host` 401 |
| Login by email+password, role routing | `admin-frontend/src/pages/LoginPage.jsx`, `App.js` `WorkspaceLanding` | authenticated flows in `auth.test.js`; live login 401/400 | none | — | PARTIAL | needs visual proof |
| Admin/all-listings view + CRUD | `admin-frontend/src/pages/ViewListings.jsx` (admin context) | no automated CRUD test; build PASS | none | — | PARTIAL | add live admin pass |
| Host/listing CRUD (create/view/update/delete) | `CreateListing/UpdateListing/ViewListings.jsx`, `ListingForm.jsx` | `accommodations.test.js` create gating (401/403/201) only; **no PUT/DELETE test** | none | — | PARTIAL | outstanding: PUT/DELETE coverage |
| Users management + role change | `admin-frontend/src/pages/ManageUsers.jsx`; `userController.js` admin routes | no automated admin-route test | none | — | OUTSTANDING | only static review |
| Platform reservations view | `admin-frontend/src/pages/AllReservations.jsx`; `reservationController.js` | `reservations.test.js` (22) covers API behaviour | none | — | PARTIAL | visual proof needed |
| Sign-out + token clearing | `admin-frontend/src/components/Header.jsx` logout | none | none | — | PARTIAL | code-verified only |
| Rubric-exact routing (host vs admin) | `admin-frontend/src/App.js` route table | build PASS | none | — | PARTIAL | click-through proof needed |

## Area 2 — Frontend Clone (140)

| Requirement | Implementation | Automated verification | Screenshot evidence | Evidence ID | Status | Notes |
|---|---|---|---|---|---|---|
| Nav/header: brand, search, auth state, profile, host entry | `frontend/src/components/Header.js` | build PASS | none | — | PARTIAL | visual proof |
| Home: hero, destinations, experience/gift/Future Getaways, footer | `frontend/src/pages/HomePage.js`, `Footer.js` | build PASS | none | — | PARTIAL | visual proof |
| Location results: filters, count, cards, states | `frontend/src/pages/LocationPage.js` | `accommodations.test.js` filter/list; build PASS | none | — | PARTIAL | loading/empty/error visual |
| Property details: gallery, amenities, reviews, host, rules, costs | `frontend/src/pages/LocationDetailsPage.js` | `get by id` covered; build PASS | none | — | PARTIAL | visual proof |
| Reservation/cost calculator | `LocationDetailsPage.js` panel; server recomputes totals | `reservations.test.js` total/date/guest/overlap (server side) | none | — | PASS | UI still needs visual proof → PARTIAL at full rubric |
| Auth flows on guest side | `LoginPage.jsx`, `RegisterPage.jsx`, `AuthContext.js`, `ProtectedRoute.jsx` | `auth.test.js` (16) + live 401/400/403 | none | — | PASS | redirect visuals pending |
| Responsive 1440/768/390 | CSS responsive rules (design notes) | none | none | — | OUTSTANDING | no evidence captured |
| Brand look (coral `#FF385C`, type, radius) | global styles + `PRODUCT_EXPERIENCE.md` | build PASS | none | — | PARTIAL | visual proof |

## Area 3 — Node.js Backend (150)

| Requirement | Implementation | Automated verification | Screenshot evidence | Evidence ID | Status | Notes |
|---|---|---|---|---|---|---|
| Structure: controllers/models/routes/middleware/app+server | `backend/**` | `health.test.js` (app wiring) | — | — | PASS | |
| Accommodation CRUD | `accommodationController.js` | read/list/create in `accommodations.test.js` | — | — | PARTIAL | PUT/DELETE untested |
| Ownership checks + admin override | `requireOwnerOrAdmin` wiring | static review only | — | — | OUTSTANDING | needs test/live pass |
| Validation (required/numeric) | controllers via `AppError` | 400 paths in suites | — | — | PASS | |
| Register/login hashed passwords | `userController.js` bcrypt | `auth.test.js` (16) | — | — | PASS | |
| JWT issue/validate/expiry/roles | `middleware/auth.js` | `auth.test.js` (valid/expired/invalid 401, role 403) | — | — | PASS | |
| Reservation CRUD + cancel | `reservationController.js` | `reservations.test.js` (22) | — | — | PASS | |
| Server-side totals | reservation controller calc | "correct total cost breakdown" test | — | — | PASS | |
| Date/guest validation | controller validation | past-date 400, capacity 400 tests | — | — | PASS | |
| Overlap detection create+update | controller overlap check | 400-on-overlap tests | — | — | PASS | |
| Correct 400/401/403/404 | app + middleware | suites + live probes | — | — | PASS | |
| Safe errors, no stack traces in prod | `middleware/errorHandler.js` | health/test JSON 404; live probes | — | — | PASS | |
| Mongoose relationships/population | `Reservation.js` populate | static review only | — | — | OUTSTANDING | add population smoke check |
| CORS allow-list, no open access | `backend/app.js` | live `Access-Control-Allow-Origin` probe | — | — | PASS | |
| Secrets via env only, no `.env` tracked | `.gitignore` + `.env.example` | repo scan | — | — | PASS | |
| Tests expanded for confirmed gaps | 4 suites, 51 tests | rerun 2026-09-16 all green | — | — | PASS | PUT/DELETE accommodation gap remains |

## Historical records (preserved, not reverified)

| Claim | Source | Status |
|---|---|---|
| Backend 40/40 PASS | `DEPLOYMENT_QA_REPORT.md` (2026-09-04) | HISTORICAL |
| Backend 44/44 PASS | committed `RENDER_REDEPLOY.md` (2026-09-05) | HISTORICAL |
| Backend 51/51 PASS | working-tree `RENDER_REDEPLOY.md` (2026-09-05) | HISTORICAL — now re-verified current (2026-09-16) |
| Host-flow E2E 25/25 × 3 runs | working-tree `RENDER_REDEPLOY.md` (2026-09-05) | HISTORICAL — no harness/artifact exists |

See [`../historical/README.md`](../historical/README.md).

## Outstanding blockers to full marks

1. **Screenshots** (visual proof) — none exist; capture per checklist.
2. Accommodation PUT/DELETE automated test.
3. Admin user/role-route automated test.
4. Live authenticated CRUD pass (create/update/delete) against production.
5. Mongoose population smoke check.
6. Responsive captures at 1440 / 768 / 390.