# RTTEST / regression — Regression mapping

How every primary user journey maps to the currently runnable/verified checks.
Recommendation: run the automated suites once after any change, then re-walk the
affected journey manually.

| Journey | Core repo code | Automated coverage | Live production coverage |
|---|---|---|---|
| **Guest register/login → session** | [`userController`](../../backend/controllers/userController.js), frontend [`RegisterPage/LoginPage`](../../frontend/src/pages/LoginPage.jsx) | `backend/tests/auth.test.js` (16) | live 401/400 checks + host-flow history |
| **Host register → host workspace** | [`userController`](../../backend/controllers/userController.js), [`admin-frontend App.js`](../../admin-frontend/src/App.js) routing | `auth.test.js` (host 201) | — |
| **Admin login → admin dashboard** | [`userController`](../../backend/controllers/userController.js), admin `App.js` | `auth.test.js` (403 wrong-role, valid-role 200) | — |
| **Search → results → property** | [`LocationPage`](../../frontend/src/pages/LocationPage.js), [`LocationDetailsPage`](../../frontend/src/pages/LocationDetailsPage.js) | `accommodations.test.js` (list/filter/get-by-id, 10) | `GET /api/accommodations` → 200, 27 |
| **Reserve → confirmation → My Reservations** | [`reservationController`](../../backend/controllers/reservationController.js), frontend details + [`UserReservationsPage`](../../frontend/src/pages/UserReservationsPage.jsx) | `reservations.test.js` (22) | 401 guard live; full authenticated flow outstanding |
| **Host manage listings (create/view/update/delete)** | [`accommodationController`](../../backend/controllers/accommodationController.js), admin `Create/Update/ViewListings` | create gating covered (401/403/201); **update/delete NOT covered** | outstanding (authenticated live pass) |
| **Host reservations + stats** | `reservationController`, [`HostReservations`](../../admin-frontend/src/pages/HostReservations.jsx), [`HostDashboard`](../../admin-frontend/src/pages/HostDashboard.jsx) | `reservations.test.js` (host q/filter/stats) | 401 guard live |
| **Admin manage users / roles** | [`userController`](../../backend/controllers/userController.js) admin routes, [`ManageUsers`](../../admin-frontend/src/pages/ManageUsers.jsx) | role gating via `requireAdmin` (static review); no dedicated automated test | outstanding |
| **Admin all-listings / all-reservations** | admin `ViewListings`/`AllReservations` | 401 guard only (static review) | outstanding |

## Regression trigger

After any change, at minimum rerun:

```powershell
cd backend && npm test                    # 4 suites / 51 tests — must stay all-green
cd frontend && CI=true npm run build      # guest build
cd admin-frontend && CI=true npm run build
```

Results: [`../results/`](../results/README.md).

## Known coverage gaps (see also `inventory.md`)

1. Accommodation PUT/DELETE (ownership + admin override) — no automated test.
2. Reservation create/update/delete against live production data.
3. Admin-only routes (user management, role changes) — no automated test.
4. Frontend component tests — none.
5. E2E harness — none.