# RTTEST / evidence — Screenshot checklist

Required to convert **PARTIAL (code/build-verified)** evidence into visual proof.
Run against the **live deployment** first (no local setup):

- Guest: `https://airbnb-guest.onrender.com`
- Admin/host: `https://airbnb-1-e7hp.onrender.com`
- API docs: `https://airbnb-zq1x.onrender.com`

Then repeat the three most important screens at 1440 / 768 / 390 px to prove
responsiveness (or use DevTools device emulation). Save files in style
`evidence/screenshots/<name>.png` and tick the box.

> Each listed item is a **requested capture**. Nothing here claims a screenshot
> already exists — none do.

## Guest frontend (public)

- [ ] **home-desktop-1440.png** — hero, search rail, CTA
- [ ] **home-destinations.png** — inspiration/location cards
- [ ] **home-discover-sections.png** — two discover-experience sections
- [ ] **home-giftcards.png** — gift-card/shop section
- [ ] **home-future-getaways.png** — Future Getaways tabs (2 states)
- [ ] **home-footer.png** — structured footer + copyright
- [ ] **search-results-ny.png** — New York results: heading, count, cards (image/type/title/location/rating/reviews/price)
- [ ] **search-loading.png** and **search-empty.png** — loading & empty states
- [ ] **property-details.png** — title/type/location/rating/host/capacity
- [ ] **property-gallery.png** — main + 4 gallery images; lightbox open with prev/next/close
- [ ] **property-amenities.png** — amenities & sleeping arrangement
- [ ] **property-reviews-host-safety-rules.png** — reviews, host card, safety/cancellation/house rules
- [ ] **property-cost-calc.png** — dates+guests+nightly+fees+taxes+total
- [ ] **reserve-error-validation.png** — invalid dates / over-capacity error
- [ ] **login.png** and **register.png** — forms + duplicate-email error
- [ ] **my-reservations.png** — guest bookings list

## Host workspace

- [ ] **host-login.png** — role form
- [ ] **host-dashboard.png** — counts, upcoming, earnings, actions
- [ ] **host-create-listing.png** — full form with validation + image upload preview
- [ ] **host-view-listings.png** — own listings with actions
- [ ] **host-update-listing.png** — pre-filled form saved
- [ ] **host-reservations.png** — guest/date-range/total rows

## Administrator workspace

- [ ] **admin-login.png**
- [ ] **admin-dashboard.png** — listings/reservations/earnings signals
- [ ] **admin-listings.png** — all listings (all hosts) + CRUD
- [ ] **admin-users.png** — role change with confirmation
- [ ] **admin-reservations.png** — platform-wide reservations

## Responsiveness (run at 768 and 390 for the three routes below)

- [ ] **responsive-guest-home-768.png** / **-390.png**
- [ ] **responsive-search-results-768.png** / **-390.png**
- [ ] **responsive-property-details-768.png** / **-390.png**
- [ ] **responsive-host-dashboard-768.png** / **-390.png**
- [ ] **responsive-admin-dashboard-768.png** / **-390.png**

Checks to watch per width: horizontal overflow, clipped buttons, unreadable
text, broken images, unusable forms/inputs, working redirects, no console errors
from failed fetches.

## Evidence-of-run requirements (per screenshot)

- Name + date in the image or an accompanying manifest (`evidence/screenshots/manifest.md`).
- List the URL and viewport used.
- For authenticated screens: note the role account type used (never record
  passwords in filenames or captions — document credentials by **role**
  only, e.g. "host account").