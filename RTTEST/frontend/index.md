# RTTEST / frontend — Frontend verification

Two React applications ship in this repo:

| App | Location | Deployed | Stack |
|---|---|---|---|
| Guest/public | [`frontend/`](../../frontend/) | `https://airbnb-guest.onrender.com` | React 18 + `react-scripts` 5 (CRA) |
| Host + Administrator | [`admin-frontend/`](../../admin-frontend/) | `https://airbnb-1-e7hp.onrender.com` | React 18 + `react-scripts` 5 (CRA) |

## Verified

| Check | Result | Evidence |
|---|---|---|
| Guest production build | **PASS** | [`../results/builds-current.md`](../results/builds-current.md) |
| Admin production build | **PASS** | same |
| Live guest SPA serves + deep links work | **PASS** | [`../results/deployment-current.md`](../results/deployment-current.md) |
| Live admin SPA serves + deep links work | **PASS** | same |
| Guest automated **unit** tests | **none exist** (`CI=true npm test` → "No tests found", exit 1) | run 2026-09-15 |
| Admin automated **unit** tests | **none exist** | run 2026-09-15 |

## Page-to-file map

| Rubric area | Files |
|---|---|
| Guest header (brand, nav, search, auth state, profile, reservations, host entry) | [`frontend/src/components/Header.js`](../../frontend/src/components/Header.js) |
| Guest home (hero, destinations, experience sections, gift-card section, Future Getaways, footer) | [`frontend/src/pages/HomePage.js`](../../frontend/src/pages/HomePage.js), [`frontend/src/components/`](../../frontend/src/components/) |
| Guest search / location results | [`frontend/src/pages/LocationPage.js`](../../frontend/src/pages/LocationPage.js) |
| Guest property details (gallery, amenities, reviews, host, safety, house rules, cost calculator) | [`frontend/src/pages/LocationDetailsPage.js`](../../frontend/src/pages/LocationDetailsPage.js) |
| Guest login / register | [`frontend/src/pages/LoginPage.jsx`](../../frontend/src/pages/LoginPage.jsx), [`RegisterPage.jsx`](../../frontend/src/pages/RegisterPage.jsx) |
| Guest reservations | [`frontend/src/pages/UserReservationsPage.jsx`](../../frontend/src/pages/UserReservationsPage.jsx) |
| Guest app shell + routes | [`frontend/src/App.js`](../../frontend/src/App.js) |
| Admin header/nav (role-aware) | [`admin-frontend/src/components/Header.jsx`](../../admin-frontend/src/components/Header.jsx) |
| Admin login | [`admin-frontend/src/pages/LoginPage.jsx`](../../admin-frontend/src/pages/LoginPage.jsx) |
| Host dashboard | [`admin-frontend/src/pages/HostDashboard.jsx`](../../admin-frontend/src/pages/HostDashboard.jsx) |
| Host create/update/view/delete listings | [`CreateListing.jsx`](../../admin-frontend/src/pages/CreateListing.jsx), [`UpdateListing.jsx`](../../admin-frontend/src/pages/UpdateListing.jsx), [`ViewListings.jsx`](../../admin-frontend/src/pages/ViewListings.jsx), [`ListingForm.jsx`](../../admin-frontend/src/components/ListingForm.jsx) |
| Host reservations | [`admin-frontend/src/pages/HostReservations.jsx`](../../admin-frontend/src/pages/HostReservations.jsx) |
| Admin dashboard (all-platform listings view; `/admin/dashboard` renders the shared listings page) | [`admin-frontend/src/pages/ViewListings.jsx`](../../admin-frontend/src/pages/ViewListings.jsx) via [`admin-frontend/src/App.js`](../../admin-frontend/src/App.js) |
| Admin manage listings/users/reservations | [`ViewListings.jsx`](../../admin-frontend/src/pages/ViewListings.jsx), [`ManageUsers.jsx`](../../admin-frontend/src/pages/ManageUsers.jsx), [`AllReservations.jsx`](../../admin-frontend/src/pages/AllReservations.jsx) |
| Admin app shell + routes | [`admin-frontend/src/App.js`](../../admin-frontend/src/App.js) |

## Outstanding

- **Automated frontend tests** (none). Either accept manual verification as the
  evidence (recommended, with screenshots), or add targeted component tests.
- A responsive pass at 1440 / 768 / 390 px, and the full
  [`screenshot-checklist.md`](../evidence/screenshot-checklist.md).