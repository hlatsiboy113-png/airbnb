# RTTEST / production — Production deployment checks

## Deployed footprint (verified 2026-09-15)

| Service | Render service | URL |
|---|---|---|
| Backend API (Express + Mongoose, health `/health`) | `airbnb-zq1x` | `https://airbnb-zq1x.onrender.com` |
| Guest frontend (CRA static) | `airbnb-guest` | `https://airbnb-guest.onrender.com` |
| Admin/host frontend (CRA static) | `airbnb-1-e7hp` | `https://airbnb-1-e7hp.onrender.com` |

Configuration is declared in [`render.yaml`](../../render.yaml) (Render
Blueprints):

- Backend service: build `cd backend && npm install && npm start`, private env
  (`MONGO_URI`, `JWT_SECRET`), health check `/health`, `start: false` before
  `npm start` sync semantics.
- Both statics: `npm install && npm run build`, with `REACT_APP_API_URL` baked at
  build time.
- `CORS_ORIGIN`: the allow-list of the two frontend origins (wired in [`backend/app.js`](../../backend/app.js)).

## Verified live (2026-09-15)

See [`results/deployment-current.md`](../results/deployment-current.md) for the
full table. Headlines: `GET /health` 200; `GET /api/accommodations` 200 (27);
401/400 modelling for unknown login, bad login, and no-token protected routes;
`/users/seed` 404 in prod; CORS allow-list honoured; SPA deep links return
`index.html` on both frontends.

## Security / hygiene notes

| Concern | State |
|---|---|
| `.env` files | gitignored; only `.env.example` files are committed (envar names only) |
| Secrets in docs | ✓ README and RTTEST contain **no** credentials (redaction pass performed 2026-09-15) |
| `node_modules` / `build/` tracked | none (both gitignored) |
| Seed endpoint in production | blocked (404) |
| CORS | restricted to the two frontend origins |
| Error responses | JSON 404 handler; no stack traces in production responses (verified by test + live probe) |

## Reproducing a deploy

1. `render.yaml` is the source of truth — a new Blueprint import recreates all 3
   services.
2. Secrets (`MONGO_URI`, `JWT_SECRET`) are set in Render, never committed.
3. Static builds require `REACT_APP_API_URL` (the public backend origin) at build
   time; the local build commands in
   [`results/README.md`](../results/README.md) match what Render runs.