# RTTEST / authentication — Authentication & authorization evidence

## Automated (CURRENT VERIFIED)

`backend/tests/auth.test.js` + the guard-rail checks in
`backend/tests/{accommodations,reservations}.test.js` cover:

- **Registration** — incomplete payloads → 400; duplicate email → 409; guest /
  host sign-up → 201; a registration that tries to self-promote to
  `admin` is **not** honoured (account is created with the `user` role) —
  protects against public administrator registration.
- **Login** — missing fields → 400; unknown email → 401; wrong password → 401;
  valid → 200 with a JWT; signing in with a wrong `role` for that account → 403.
- **Authorization (backend-enforced, independent of React)** —
  - `GET /users/me`: no token → 401; invalid token → 401; expired token → 401;
    valid token → 200.
  - `POST /accommodations`: no token → 401; logged-in guest → 403; host → 201.
  - `GET /reservations/host`: logged-in guest → 403.
  - Reservation update/delete: non-owner → 403, owner → 200.
  - Admin-only routes (`GET /users`, role updates) are behind `requireAdmin`.

## Live production (CURRENT VERIFIED, 2026-09-15)

| Check | URL | Result |
|---|---|---|
| Unknown-email login | `POST https://airbnb-zq1x.onrender.com/api/users/login` | 401 |
| Missing password | same | 400 |
| No-token `/users/me` | `GET …/api/users/me` | 401 |
| No-token `/reservations/host` | `GET …/api/reservations/host` | 401 |
| No-token accommodation create | `POST …/api/accommodations` | 401 |
| Seed endpoint in prod | `POST …/api/users/seed` | 404 |

## Frontend wiring

| Concern | Evidence |
|---|---|
| Guest login/register pages | [`frontend/src/pages/LoginPage.jsx`](../../frontend/src/pages/LoginPage.jsx), [`RegisterPage.jsx`](../../frontend/src/pages/RegisterPage.jsx) |
| Host layout login and role routing | [`admin-frontend/src/pages/LoginPage.jsx`](../../admin-frontend/src/pages/LoginPage.jsx) |
| Token storage + `AuthContext` on guest | [`frontend/src/context/AuthContext.js`](../../frontend/src/context/AuthContext.js), [`frontend/src/services/api.js`](../../frontend/src/services/api.js) |
| Token storage + `AuthContext` on admin | [`admin-frontend/src/context/AuthContext.js`](../../admin-frontend/src/context/AuthContext.js), [`admin-frontend/src/services/api.js`](../../admin-frontend/src/services/api.js) |
| Protected route component (guest) | [`frontend/src/components/ProtectedRoute.jsx`](../../frontend/src/components/ProtectedRoute.jsx) |
| ProtectedRoute (admin) | [`admin-frontend/src/components/ProtectedRoute.jsx`](../../admin-frontend/src/components/ProtectedRoute.jsx) |
| JWT middleware (server side) | [`backend/middleware/auth.js`](../../backend/middleware/auth.js) |

> Note: an administrator account is seeded via the backend's development seed
> accounts (`backend/controllers/userController.js` → `DEFAULT_USERS`) and there
> is **no public administrator registration route**. Credentials are documented
> by environment-variable name only; see
> [`backend/.env.example`](../../backend/.env.example).