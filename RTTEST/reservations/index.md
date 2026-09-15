# RTTEST / reservations — Reservation evidence

## Automated (CURRENT VERIFIED) — `backend/tests/reservations.test.js`

| Behaviour | Verification |
|---|---|
| Create: unauthenticated → 401 | covered |
| Create: guests over capacity → 400 | covered |
| Create: invalid/backwards dates → 400 | covered |
| Create: past check-in → 400 | covered |
| Create: server-side total calculation (never trusts client totals) → 201 with correct total | covered |
| Create: overlapping reservation → 400 | covered |
| Create: non-overlapping → 201 | covered |
| Get by user: returns only the user's own reservations | covered |
| Get by host: guest → 403; host-scoped query; status filter `q`; cases | covered |
| Update: owner → 200; non-owner → 403 | covered |
| Update: past check-in → 400; overlap → 400 | covered |
| Delete: owner → 200; non-owner → 403 | covered |
| Host stats: host → 200 counts/totals; guest → 403 | covered |

## Live production (CURRENT VERIFIED, 2026-09-15)

| Check | Result |
|---|---|
| `GET /api/reservations/host` no token | 401 |

## Frontend wiring

| Concern | Evidence |
|---|---|
| Guest booking panel + cost calculator | [`frontend/src/pages/LocationDetailsPage.js`](../../frontend/src/pages/LocationDetailsPage.js) |
| Guest "My Reservations" | [`frontend/src/pages/UserReservationsPage.jsx`](../../frontend/src/pages/UserReservationsPage.jsx) |
| Host reservations monitor | [`admin-frontend/src/pages/HostReservations.jsx`](../../admin-frontend/src/pages/HostReservations.jsx) |
| Admin all-reservations | [`admin-frontend/src/pages/AllReservations.jsx`](../../admin-frontend/src/pages/AllReservations.jsx) |
| Server-side cost rules (fees, discounts, taxes) | [`backend/controllers/reservationController.js`](../../backend/controllers/reservationController.js) |

## Outstanding

- Live **authenticated** create/update/delete pass against production data
  (manual). The suite covers behaviour with mocked models; a live pass adds data
  realism, not logic coverage.