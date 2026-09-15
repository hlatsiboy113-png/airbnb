# RTTEST / results — Live production checks (2026-09-15)

All checks below were executed against the **live Render deployment** on
2026-09-15. This is a hosted confirmation of the deployed system, not a local
simulation.

## Live endpoints

| Service | URL |
|---|---|
| Backend API | `https://airbnb-zq1x.onrender.com` |
| Guest frontend | `https://airbnb-guest.onrender.com` |
| Admin/host frontend | `https://airbnb-1-e7hp.onrender.com` |

## API checks

| # | Check | Result |
|---|---|---|
| 1 | `GET /health` | **200** — `{"status":"success","message":"AirStay API is running"}` |
| 2 | `GET /api/accommodations` | **200** — JSON array with `count: 27` (seed coverage below) |
| 3 | `POST /api/users/login` with unknown email | **401** (no account leaked) |
| 4 | `POST /api/users/login` with email only (missing password) | **400** (validation) |
| 5 | `GET /api/users/me` with no token | **401** |
| 6 | `GET /api/reservations/host` with no token | **401** |
| 7 | `POST /api/accommodations` with no token | **401** |
| 8 | `POST /api/users/seed` | **404** (seed endpoint blocked in production) |
| 9 | `GET /api/accommodations` with `Origin: https://airbnb-guest.onrender.com` | **200** with header `Access-Control-Allow-Origin: https://airbnb-guest.onrender.com` (allow-list works; no origin leaked) |

Seed coverage confirmed from `GET /api/accommodations` (27 total):

| Location | Count |
|---|---|
| New York | 5 |
| Paris | 5 |
| Tokyo | 5 |
| Cape Town | 5 |
| Canmore | 3 |
| Other | 4 |

## SPA (static) checks

| # | Check | Result |
|---|---|---|
| 10 | `GET https://airbnb-guest.onrender.com/` | **200** — CRA index.html (bundle `main.cc838128.js`, css `main.a8e709af.css`) |
| 11 | `GET https://airbnb-guest.onrender.com/login` (deep link) | **200** — SPA index.html returned |
| 12 | `GET https://airbnb-guest.onrender.com/listing/<id>` (deep link) | **200** — SPA index.html returned |
| 13 | `GET https://airbnb-1-e7hp.onrender.com/` | **200** — SPA index.html |
| 14 | `GET https://airbnb-1-e7hp.onrender.com/admin/login` (deep link) | **200** — SPA index.html |
| 15 | `GET https://airbnb-1-e7hp.onrender.com/host/dashboard` (deep link) | **200** — SPA index.html |

Deep-link 200s confirm the SPA rewrites work (browser sees `index.html` for any
route), which is required for direct navigation/login redirects in production.

## Interpretation

- The deployed API independently enforces auth/role guard rails (401/400/404
  responses) **without any client involvement**.
- CORS is restricted to the two deployed frontend origins.
- The seed endpoint is correctly disabled in production.
- The 27-listing seed data satisfies the 4 required locations × ≥5 stays rule.