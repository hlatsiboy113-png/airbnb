# RTTEST / accommodations — Accommodation CRUD evidence

## Automated (CURRENT VERIFIED) — `backend/tests/accommodations.test.js`

| Behaviour | Verification |
|---|---|
| List all accommodations | GET `/api/accommodations` covered |
| Location filter (regex-safe/escaped) | GET `/api/accommodations?location=<City>` covered |
| Guest-count filter | covered |
| GET by id: existing → 200; non-existent → 404; malformed ObjectId → 400 | covered |
| Create: no token → 401 | covered |
| Create: authenticated **guest** → 403 | covered |
| Create: authenticated **host** → 201 | covered |
| Update/delete ownership + admin override | **No automated coverage** (debug-confirmed: `accommodations.test.js` has no PUT/DELETE test). Route wiring verified by static review only: `/accommodations/:id` PUT/DELETE go through `requireOwnerOrAdmin` in [`backend/controllers/accommodationController.js`](../../backend/controllers/accommodationController.js). An authenticated live CRUD pass is listed under **Outstanding** below. |

## Live production (CURRENT VERIFIED, 2026-09-15)

| Check | Result |
|---|---|
| `GET https://airbnb-zq1x.onrender.com/api/accommodations` | 200, 27 listings |
| Seed coverage: New York / Paris / Tokyo / Cape Town | ≥5 each |

## Frontend wiring

| Concern | Evidence |
|---|---|
| Guest search / listing cards / filters | [`frontend/src/pages/LocationPage.js`](../../frontend/src/pages/LocationPage.js), [`LocationDetailsPage.js`](../../frontend/src/pages/LocationDetailsPage.js), [`frontend/src/components/LocationCard.js`](../../frontend/src/components/LocationCard.js) |
| Host create listing form | [`admin-frontend/src/pages/CreateListing.jsx`](../../admin-frontend/src/pages/CreateListing.jsx), [`admin-frontend/src/components/ListingForm.jsx`](../../admin-frontend/src/components/ListingForm.jsx) |
| Host update listing (pre-filled, saves) | [`admin-frontend/src/pages/UpdateListing.jsx`](../../admin-frontend/src/pages/UpdateListing.jsx) |
| Host view/delete listings | [`admin-frontend/src/pages/ViewListings.jsx`](../../admin-frontend/src/pages/ViewListings.jsx) |
| Admin all-listings + CRUD | [`admin-frontend/src/pages/ViewListings.jsx`](../../admin-frontend/src/pages/ViewListings.jsx) (shared component, admin context) |
| Image upload (Multer) | [`backend/controllers/accommodationController.js`](../../backend/controllers/accommodationController.js), [`backend/middleware/upload.js`](../../backend/middleware/upload.js) |

## Outstanding

- Authenticated **update/delete against the live production API** (no committed
  output). The mocked suite covers the logic; a manual live pass with a real
  host token would close this gap.