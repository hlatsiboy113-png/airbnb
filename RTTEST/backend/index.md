# RTTEST / backend — Automated backend tests

The real, runnable backend test suite lives in `backend/tests/` and is executed
by the repository's own script (`backend/package.json` → `"test": "jest
--runInBand"`). This page is an index; it does not duplicate the tests.

## The tests

| File | What it verifies |
|---|---|
| [`backend/tests/setup-env.js`](../../backend/tests/setup-env.js) | Bootstrap: `NODE_ENV=test` + test-only `JWT_SECRET` |
| [`backend/tests/auth.test.js`](../../backend/tests/auth.test.js) | Login/register, validation errors, duplicate email, JWT issue/validation, role checks, `/users/me` (401/200/expired), production seed block, **admin-route gate** (`GET /api/users`, `PATCH /users/:id/role`) |
| [`backend/tests/accommodations.test.js`](../../backend/tests/accommodations.test.js) | List/filter (location, guests), get-by-id (200/400/404), create gating (401 guest/403 unauthenticated guest/201 host), **PUT/DELETE ownership + admin override** |
| [`backend/tests/reservations.test.js`](../../backend/tests/reservations.test.js) | Create (validation, overlap, server-side totals), delete (ownership), get by user/host, update (ownership/overlap/past dates), host stats, **admin gate on `GET /api/reservations`** |
| [`backend/tests/health.test.js`](../../backend/tests/health.test.js) | `/health` 200, unknown route 404 JSON, root 404 |

## Run them

```powershell
cd backend
npm install          # if node_modules missing
npm test             # 4 suites, 72 tests — all must pass
```

## Constraints reflected in the suite

- The suite **does not require MongoDB** — the Mongoose models are mocked, so it
  is deterministic and runs anywhere.
- It exercises the Express app through HTTP (Supertest) so it verifies routing,
  middleware, auth, and status codes end-to-end at the API layer.
- No secrets are used: `JWT_SECRET` in `setup-env.js` is a test-only value.

## Current result

**72/72 PASS · 4/4 suites** — raw output in
[`../results/backend-current.txt`](../results/backend-current.txt) (run 2026-09-16).

On 2026-09-16 the suite grew from 51 to 72 tests: 11 new accommodation
PUT/DELETE authorization tests (401/403 non-owner/200 owner/200 admin/404), 6 new
admin-route tests for `/api/users` (401/403/200 + role change 403/200 + self-demote
block 400), and 4 new admin-gate tests for `GET /api/reservations` (401/403/403/200).
These directly cover the previously outstanding "PUT/DELETE ownership + admin
routing" rubric rows.