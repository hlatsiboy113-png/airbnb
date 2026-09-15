# RTTEST / backend — Automated backend tests

The real, runnable backend test suite lives in `backend/tests/` and is executed
by the repository's own script (`backend/package.json` → `"test": "jest
--runInBand"`). This page is an index; it does not duplicate the tests.

## The tests

| File | What it verifies |
|---|---|
| [`backend/tests/setup-env.js`](../../backend/tests/setup-env.js) | Bootstrap: `NODE_ENV=test` + test-only `JWT_SECRET` |
| [`backend/tests/auth.test.js`](../../backend/tests/auth.test.js) | Login/register, validation errors, duplicate email, JWT issue/validation, role checks, `/users/me` (401/200/expired), production seed block |
| [`backend/tests/accommodations.test.js`](../../backend/tests/accommodations.test.js) | List/filter (location, guests), get-by-id (200/400/404), create gating (401 guest/403 unauthenticated guest/201 host) |
| [`backend/tests/reservations.test.js`](../../backend/tests/reservations.test.js) | Create (validation, overlap, server-side totals), delete (ownership), get by user/host, update (ownership/overlap/past dates), host stats |
| [`backend/tests/health.test.js`](../../backend/tests/health.test.js) | `/health` 200, unknown route 404 JSON, root 404 |

## Run them

```powershell
cd backend
npm install          # if node_modules missing
npm test             # 4 suites, 51 tests — all must pass
```

## Constraints reflected in the suite

- The suite **does not require MongoDB** — the Mongoose models are mocked, so it
  is deterministic and runs anywhere.
- It exercises the Express app through HTTP (Supertest) so it verifies routing,
  middleware, auth, and status codes end-to-end at the API layer.
- No secrets are used: `JWT_SECRET` in `setup-env.js` is a test-only value.

## Current result

**51/51 PASS · 4/4 suites** — raw output in
[`../results/backend-current.txt`](../results/backend-current.txt) (run 2026-09-15).