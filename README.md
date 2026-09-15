# AirStay — Full-Stack Accommodation Marketplace

AirStay is a full-stack accommodation marketplace inspired by familiar short-stay booking patterns. The project separates the guest-facing discovery and booking experience from the host and administrator workspace, while both applications use a shared Node.js, Express, MongoDB, Mongoose, JWT, and Multer API.

The public interface is designed around destination discovery, transparent reservation pricing, and calm, concise copy. The workspace supports listing management, host reservation monitoring, administrator user-role management, and platform-wide reservation oversight.

## Architecture

| Directory | Responsibility | Main journeys |
|---|---|---|
| `frontend/` | React public frontend | Guest discovery, search, listing details, reservation, account reservations |
| `admin-frontend/` | React host and administrator frontend | Host dashboard/listings/reservations; administrator listings/users/reservations |
| `backend/` | Express and MongoDB API | Authentication, listings, reservations, image upload, authorization |
| `testing/` | Manual validation guidance | Functional and journey verification |
| `RTTEST/` | Test & evidence inventory | Current-result evidence, historical claims, rubric matrix |

**Application stack:** React 18 + Create React App (`react-scripts` 5) on both
frontends · Node.js/Express 4 + Mongoose 8 backend · MongoDB · JWT + bcryptjs
authentication · Multer uploads · Render (Blueprint in [`render.yaml`](render.yaml)).

## Live Deployment

| Service | URL |
|---|---|
| Guest frontend | `https://airbnb-guest.onrender.com` |
| Host/administrator frontend | `https://airbnb-1-e7hp.onrender.com` |
| API (base `/api`) | `https://airbnb-zq1x.onrender.com` |
| API health check | `https://airbnb-zq1x.onrender.com/health` |

## Local Setup

Clone the repository, then set up each application in a separate terminal. The API must be running before data-driven pages can load.

```bash
git clone https://github.com/hlatsiboy113-png/airbnb.git
cd airbnb

cp backend/.env.example backend/.env
# Set MONGO_URI; replace JWT_SECRET with a long, random value.
```

Start the API:

```bash
cd backend && npm install && npm run dev
```

Start the public site from a second terminal. It normally runs at `http://localhost:3000`.

```bash
cd frontend
npm install
npm start
```

Start the host/administrator workspace from a third terminal. If port 3000 is in use, accept the prompt to use port 3001.

```bash
cd admin-frontend
npm install
npm start
```

## Environment Variables

| Variable | Used by | Purpose |
|---|---|---|
| `PORT` | Backend | HTTP port for the API; defaults to `5000`. |
| `NODE_ENV` | Backend | Runtime environment; use `production` when deployed. |
| `MONGO_URI` | Backend | MongoDB connection string. |
| `JWT_SECRET` | Backend | Secret used to sign and validate access tokens. |
| `CORS_ORIGIN` | Backend | Comma-separated allow-list of browser origins (deployed frontends). |
| `REACT_APP_API_URL` | Both frontends | Production API base URL including `/api`. |
| `REACT_APP_ADMIN_URL` | Public frontend | Full base URL for the host/admin workspace. |
| `REACT_APP_PUBLIC_URL` | Admin frontend | Full base URL for the public frontend. |

No populated `.env` file is committed. Only the `.env.example` files (variable
names, no secrets) are tracked.

## Demo Accounts

The backend seeds development accounts (guest, host, administrator) through its
user-seeding logic during local development. Credentials are defined only in
code and are **not** documented here; configure them through your own local
seed/environment. There is **no public administrator registration route** — an
account cannot be self-promoted to the administrator role, and the API rejects
sign-in with a wrong role for an account.

## User Journeys

A **guest** arrives on the destination carousel, searches or selects a featured location, compares accommodation cards, and verifies host, amenity, review, house-rule, safety, cancellation, and cost information before making a reservation. The guest can then visit **My reservations** to review or cancel bookings.

A **host** signs in and goes directly to the host dashboard. The dashboard frames three immediate actions: create a listing, manage existing listings, and review reservations. Summary cards display active listing count, total reservations, upcoming reservations, and non-cancelled earnings.

An **administrator** signs in to an access-controlled workspace. They can view all listings, change another user’s role, and review every reservation across the platform. The API prevents an administrator from downgrading their own role.

## API Reference

All API paths below use the `/api` prefix. Routes marked **Private** require an `Authorization: Bearer <token>` header.

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/users/register` | Public | Create a guest or host account and issue a JWT (administrator registration is not public). |
| `POST` | `/users/login` | Public | Authenticate and issue a JWT; optional `role` input validated against the account. |
| `GET` | `/users/me` | Private | Fetch the active user profile. |
| `GET` | `/users` | Administrator | List registered users. |
| `PATCH` | `/users/:id/role` | Administrator | Change a user role to `user`, `host`, or `admin`. |
| `GET` | `/accommodations` | Public | Get listings; accepts optional `location` and `guests` query parameters. |
| `GET` | `/accommodations/:id` | Public | Get an accommodation and host summary. |
| `POST` | `/accommodations` | Host / Administrator | Create a listing with optional images. |
| `PUT` | `/accommodations/:id` | Owner host / Administrator | Update an existing listing. |
| `DELETE` | `/accommodations/:id` | Owner host / Administrator | Remove a listing. |
| `POST` | `/reservations` | Private | Create a reservation; totals are recalculated server-side. |
| `GET` | `/reservations/user` | Private | List the signed-in guest’s reservations. |
| `PUT` | `/reservations/:id` | Owner guest / Administrator | Update future reservation dates or guest count. |
| `DELETE` | `/reservations/:id` | Owner guest / Host / Administrator | Cancel a reservation. |
| `GET` | `/reservations/host` | Host / Administrator | List reservations for the signed-in host’s properties. |
| `GET` | `/reservations/host/stats` | Host / Administrator | Return host earnings, total reservations, and upcoming count. |
| `GET` | `/reservations` | Administrator | List reservations across the platform. |

## Testing & Verification

Start with the evidence inventory: [`RTTEST/inventory.md`](RTTEST/inventory.md).
It labels every result **CURRENT VERIFIED** (rerun 2026-09-15),
**HISTORICAL** (earlier claim, not independently rerun), or **OUTSTANDING**.

Run the checks yourself:

```bash
cd backend && npm test                 # 4 suites · 51 tests — all pass
cd ../frontend && CI=true npm run build   # requires REACT_APP_API_URL
cd ../admin-frontend && CI=true npm run build
```

| Check | Status (2026-09-15) |
|---|---|
| Backend automated tests (Jest + Supertest, no DB required) | **PASS — 51/51 (4 suites)** |
| Guest frontend production build | **PASS** |
| Host/administrator frontend production build | **PASS** |
| Guest/admin frontend unit tests | **none exist** (0 files — `react-scripts test` exits "No tests found") |
| E2E harness | **none in repository**; earlier "host-flow 25/25 × 3" runs are historical claims (see `RTTEST/historical/`) |
| Live deployment probes (401/400/404 guards, CORS, SPA rewrites) | **PASS** — `RTTEST/results/deployment-current.md` |

## Deployment

Deployment is described by the Render Blueprint in [`render.yaml`](render.yaml):
a backend API service (`airbnb-zq1x`) plus two static frontend services
(`airbnb-guest`, `airbnb-1-e7hp`). Configure `MONGO_URI`, `JWT_SECRET`,
`NODE_ENV=production`, and frontend URL variables through the deployment
platform’s secret/environment dashboard; do not commit a populated `.env` file.

Use persistent object storage (e.g. Cloudinary or S3) for production uploads,
because an ephemeral host filesystem will not retain uploaded files between
deployments.

## Assessment Evidence

- Rubric → evidence map: [`RTTEST/evidence/rubric-evidence-matrix.md`](RTTEST/evidence/rubric-evidence-matrix.md)
- Screenshot checklist (still to be captured): [`RTTEST/evidence/screenshot-checklist.md`](RTTEST/evidence/screenshot-checklist.md)
- Historical verification records: [`RTTEST/historical/README.md`](RTTEST/historical/README.md)