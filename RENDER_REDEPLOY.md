# Production Redeploy Checklist (owner action)

Production now runs current repo code (verified live: null-safe login returns
401 on unknown email; live guest bundle `main.cc838128.js`, admin
`main.d0b960c0.js`). These steps deploy repo HEAD after future changes.

## Preflight (already proven)

- Backend suite: `51/51` PASS across 4 suites (`cd backend && npm test`)
- Host-flow E2E vs live Atlas data shape: `25/25` PASS (3 consecutive runs)
- Both frontend production builds PASS; bundles bake in
  `https://airbnb-zq1x.onrender.com/api` and the `/host/update/:id` route
- Production Atlas healthy: admin/host/guest roles exist with valid bcrypt
  hashes; live data verified 2026-09-10 (18 users incl. 1 QA account,
  27 accommodations, 8 reservations)

## 1. Backend — `airbnb-zq1x` (Rebuild & Deploy)

- Redeploy from `main` at `c7ddd5b` (repo HEAD as of last full verification).
  After T1, both frontends require `REACT_APP_API_URL` to be set at build time
  (the prebuild guard fails the build otherwise) — the blueprint env below
  provides it.
- Ensure env vars on the service:
  - `NODE_ENV=production` (required: server.js and auth gating read it)
  - `MONGO_URI` (required at boot — otherwise `server.js` throws)
  - `JWT_SECRET` (required at boot)
  - `CORS_ORIGIN=https://airbnb-guest.onrender.com,https://airbnb-1-e7hp.onrender.com`
- Verify:
  - `GET /health` → 200
  - host login (role host, seeded dev account) → 200 + token
  - guest login (role guest, seeded dev account) → 200
  - admin login (role admin, seeded dev account) → 200
  - unknown email login → 401 `Invalid email or password`
  - `POST /api/accommodations` with garbage Bearer → 401 `Invalid token`
  - `GET /api/reservations/host` no token → 401

## 2. Guest static site — `airbnb-guest`

- Add SPA rewrite rule (Dashboard → Static Sites → your service → Settings →
  Redirects/Rewrites): source `/*` → destination `/index.html`, type `rewrite`.
- Build env: `REACT_APP_API_URL=https://airbnb-zq1x.onrender.com/api`,
  `REACT_APP_PUBLIC_URL=https://airbnb-guest.onrender.com`
- Rebuild & deploy on future changes (current live bundle is
  `main.cc838128.js`).
- Verify: `GET /login` and `GET /` both serve HTML (200, not 404).

## 3. Host/Admin workspace — `airbnb-1-e7hp`

- Same SPA rewrite rule (`/*` → `/index.html`).
- Build env: `REACT_APP_API_URL=https://airbnb-zq1x.onrender.com/api`,
  `REACT_APP_PUBLIC_URL=https://airbnb-guest.onrender.com`
- Rebuild & deploy.
- Verify:
  - `GET /host/dashboard` and `/admin/login` serve HTML (200, not 404)
  - Browser: host login → dashboard loads stats + listings + reservations
  - Direct URL `/host/dashboard` after login refresh stays on dashboard
  - Logout → login → guest role → redirected to guest site with token
  - Guest as host blocked (`403` on `/api/reservations/host`)

## Alternative: apply via blueprint

`render.yaml` at repo root encodes all of the above (3 services, SPA rewrites,
build commands, env). On Render: New → Blueprint → select this repo. Existing
services can be updated to match.

## Notes

- `_redirects` files are a Netlify convention; Render ignores them — the SPA
  rewrite rule above is what actually fixes deep-link 404s.
- Uploads use `multer` disk storage; files persist per instance until a
  deploy/restart. Moving to object storage (e.g. Cloudinary/S3) is out of
  scope but recommended if image persistence matters.