# Production Redeploy Checklist (owner action)

The code is verified working; production still runs an OLD backend build and
stale frontend bundles. These steps deploy repo HEAD cleanly.

## Preflight (already proven)

- Backend suite: `44/44` PASS (`cd backend && npm test`)
- Host-flow E2E vs live Atlas data shape: `25/25` PASS (3 consecutive runs)
- Both frontend production builds PASS; bundles bake in
  `https://airbnb-zq1x.onrender.com/api` and the `/host/update/:id` route
- Production Atlas healthy: jane/john/admin exist with valid bcrypt hashes
  (`jane / password321` → match true); DB clean (10 users, 24 listings,
  0 reservations)

## 1. Backend — `airbnb-zq1x` (Rebuild & Deploy)

- Redeploy from `main` at `0e16d7d` (must run repo HEAD; the earlier
  `50cb005` trigger never reached the live service).
- Ensure env vars on the service:
  - `NODE_ENV=production` (required: server.js and auth gating read it)
  - `MONGO_URI` (required at boot — otherwise `server.js` throws)
  - `JWT_SECRET` (required at boot)
  - `CORS_ORIGIN=https://airbnb-guest.onrender.com,https://airbnb-1-e7hp.onrender.com`
- Verify:
  - `GET /health` → 200
  - host login `jane@example.com / password321` (role host) → 200 + token
  - guest login `john@example.com / password123` (role guest) → 200
  - admin login `admin@example.com / admin123` (role admin) → 200
  - unknown email login → 401 `Invalid email or password`
  - `POST /api/accommodations` with garbage Bearer → 401 `Invalid token`
  - `GET /api/reservations/host` no token → 401

## 2. Guest static site — `airbnb-guest`

- Add SPA rewrite rule (Dashboard → Static Sites → your service → Settings →
  Redirects/Rewrites): source `/*` → destination `/index.html`, type `rewrite`.
- Build env: `REACT_APP_API_URL=https://airbnb-zq1x.onrender.com/api`,
  `REACT_APP_PUBLIC_URL=https://airbnb-guest.onrender.com`
- Rebuild & deploy (current live bundle `main.959065b6.js` is stale).
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