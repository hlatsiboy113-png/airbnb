# AirStay — Full-Stack Accommodation Marketplace

AirStay is a full-stack accommodation marketplace inspired by familiar short-stay booking patterns. The project separates the guest-facing discovery and booking experience from the host and administrator workspace, while both applications use a shared Node.js, Express, MongoDB, Mongoose, JWT, and Multer API.

The public interface is designed around destination discovery, transparent reservation pricing, and calm, concise copy. The workspace supports listing management, host reservation monitoring, administrator user-role management, and platform-wide reservation oversight.

## Architecture

| Directory | Responsibility | Main journeys |
|---|---|---|
| `frontend/` | Standalone React public frontend | Guest discovery, search, listing details, reservation, account reservations |
| `admin-frontend/` | Standalone React host and administrator frontend | Host dashboard/listings/reservations; administrator listings/users/reservations |
| `backend/` | Express and MongoDB API | Authentication, listings, reservations, image upload, authorization |
| `testing/` | Manual validation guidance | Functional and journey verification |

## Local Setup

Clone the repository, then set up each application in a separate terminal. The API must be running before data-driven pages can load.

```bash
git clone https://github.com/hlatsiboy113-png/airbnb.git
git checkout -b feature/airstay-experience
cd airbnb

cp backend/.env.example backend/.env
# Set MONGO_URI and replace JWT_SECRET with a long, random value.

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

Both frontends use `REACT_APP_API_URL` when it is supplied. It should include the `/api` suffix, for example `https://your-api.example.com/api`. The public frontend can use `REACT_APP_ADMIN_URL` and the workspace can use `REACT_APP_PUBLIC_URL` to link across independently deployed applications.

| Environment variable | Used by | Purpose |
|---|---|---|
| `PORT` | Backend | HTTP port for the API; defaults to `5000`. |
| `NODE_ENV` | Backend | Runtime environment; use `production` when deployed. |
| `MONGO_URI` | Backend | MongoDB connection string. |
| `JWT_SECRET` | Backend | Secret used to sign and validate access tokens. |
| `REACT_APP_API_URL` | Both frontends | Production API base URL including `/api`. |
| `REACT_APP_ADMIN_URL` | Public frontend | Full base URL for the host/admin workspace. |
| `REACT_APP_PUBLIC_URL` | Admin frontend | Full base URL for the public frontend. |

## User Journeys

A **guest** arrives on the destination carousel, searches or selects a featured location, compares accommodation cards, and verifies host, amenity, review, house-rule, safety, cancellation, and cost information before making a reservation. The guest can then visit **My reservations** to review or cancel bookings.

A **host** signs in and goes directly to the host dashboard. The dashboard frames three immediate actions: create a listing, manage existing listings, and review reservations. Summary cards display active listing count, total reservations, upcoming reservations, and non-cancelled earnings.

An **administrator** signs in to an access-controlled workspace. They can view all listings, change another user’s role, and review every reservation across the platform. The API prevents an administrator from downgrading their own role.

## API Reference

All API paths below use the `/api` prefix. Routes marked **Private** require an `Authorization: Bearer <token>` header.

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/users/register` | Public | Create a guest account and issue a JWT. |
| `POST` | `/users/login` | Public | Authenticate and issue a JWT. |
| `GET` | `/users/me` | Private | Fetch the active user profile. |
| `GET` | `/users` | Administrator | List registered users. |
| `PATCH` | `/users/:id/role` | Administrator | Change a user role to `user`, `host`, or `admin`. |
| `GET` | `/accommodations` | Public | Get listings; accepts an optional `location` query parameter. |
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

## Development Credentials

Development seeding exposes the following accounts when default users are enabled. These credentials are intended for local development only and must never be used in production.

| Role | Email | Password |
|---|---|---|
| Guest | `john@example.com` | `password123` |
| Host | `jane@example.com` | `password321` |
| Administrator | `admin@example.com` | `admin123` |

## Quality Checks

Run the API test suite from the backend folder. Build each frontend to exercise strict compile-time validation.

```bash
cd backend && npm test
cd ../frontend && CI=true npm run build
cd ../admin-frontend && CI=true npm run build
```

## Deployment

The backend includes a `Procfile` containing `web: node server.js` and declares Node 18 in its package metadata for Heroku-style deployments. Configure `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, and any frontend URL variables through the deployment platform’s secret/environment dashboard; do not commit a populated `.env` file. Use persistent object storage such as Cloudinary or S3 for production uploads because an ephemeral host filesystem will not retain uploaded files between deployments.

**Deployment URL:** _Add production link here._

**Walkthrough video:** _Add submission video link here._
