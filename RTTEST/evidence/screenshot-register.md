# RTTEST / evidence — Screenshot register

## Current status: NO SCREENSHOTS FOUND

An exhaustive search found **no genuine project screenshots** anywhere in the
repository, its git history, or the parent project folder. Nothing has been
moved, copied, or classified. Nothing has been fabricated.

### Search performed (2026-09-16)

| Location searched | Pattern | Result |
|---|---|---|
| Repository root (all tracked + untracked files) | `*.png`, `*.jpg`, `*.jpeg`, `*.webp` | **None** (only `node_modules` third-party package icons, excluded as library brand art — not project evidence) |
| Repository git history (`git ls-files` `git log --all --name-only`) | all image extensions + `e2e/cypress/playwright/puppeteer` | **None** |
| `C:\Users\blakk\Downloads\airbnb-capstone-phase1-2` (project parent) | recursive image + `screenshot|evidence|test|report` files | **None** (parent contains only the repo) |
| `frontend/public`, `admin-frontend/public` | all files | Only `index.html` + `_redirects` (no app images) |

Keywords prioritised (airbnb/airstay/admin/host/reservation/listing/login/
dashboard/property/location/home/guest/mobile/responsive/desktop/tablet/test/
e2e/evidence/screenshot): **no matching files**.

### Consequence

Until real captures are produced, every rubric row that needs visual proof stays
**PARTIAL/OUTSTANDING** in `rubric-evidence-matrix.md`. The
[`screenshot-checklist.md`](screenshot-checklist.md) defines exactly what must be
captured, at what viewports, and with what naming.

## Evidence ID scheme (for future captures)

Assign an ID **only** when a genuine screenshot supports that view.

| ID | Screen/function | Target | Viewport(s) |
|---|---|---|---|
| G01 | Guest home | `frontend/` HomePage hero + sections | 1440 / 768 / 390 |
| G02 | Guest location/search results | LocationPage results grid + filters | 1440 |
| G03 | Guest property details | LocationDetailsPage gallery, amenities, reviews, host | 1440 |
| G04 | Guest cost calculator | LocationDetailsPage reservation panel with valid dates/guests + totals | 1440 |
| G05 | Guest reservation confirmation | confirmation feedback after reserve | 1440 |
| G06 | Guest My Reservations | UserReservationsPage list | 1440 |
| H01 | Host login | admin-frontend LoginPage (role form) | 1440 |
| H02 | Host dashboard | HostDashboard stats/actions | 1440 / 768 / 390 |
| H03 | Host create listing | CreateListing + ListingForm + image previews | 1440 |
| H04 | Host view listings | ViewListings (own listings + actions) | 1440 |
| H05 | Host update listing | UpdateListing pre-filled form, saved state | 1440 |
| H06 | Host delete listing | delete feedback + list refresh | 1440 |
| H07 | Host reservations | HostReservations rows | 1440 |
| A01 | Admin dashboard | Admin listings/all-platform view | 1440 / 768 |
| A02 | Admin users / roles | ManageUsers + role-change confirmation | 1440 |
| A03 | Admin reservations | AllReservations | 1440 |
| R01 | Responsive 1440px | representative guest + host pages | 1440 |
| R02 | Responsive 768px | representative guest + host pages | 768 |
| R03 | Responsive 390px | representative guest + host pages | 390 |

Screenshots that arrive with uncertain provenance/meaning go to
[`screenshots/unclassified/`](screenshots/unclassified/README.md) and are
recorded here as **unclassified** until identified — never force-labelled.

## Capture rules (applied from the checklist)

- URL + viewport recorded per shot (in the manifest `screenshots/manifest.md`).
- Authenticated shots note the **role** used (never a password).
- No credentials in filenames or captions.