# Product Experience Direction

## Experience Goal

The public Airbnb clone should feel calm, confident, and itinerary-led rather than like a generic property catalogue. The interface will use a warm white surface, near-black typography, restrained grey dividers, rounded tactile controls, and the signature coral action colour. It will follow the supplied visual specification closely while introducing a three-location destination carousel in the hero to create visual momentum without obscuring the primary search task.

| Element | Direction |
|---|---|
| Colour | Coral `#FF385C` for decisive actions; `#222222` for primary content; `#717171` for supporting text; `#DDDDDD` for hairline dividers; `#F7F7F7` for muted surfaces. |
| Type | System/Circular-inspired sans-serif stack with 600–800 weights for clear hierarchy and compact body copy. |
| Shape | 32 px search control, 21 px pill actions, 12 px cards and gallery media, and 8 px form fields. |
| Motion | Hero transitions are cross-fades with a 5.8-second cadence, under 300 ms for controls, clear pause/play access, manual arrows, and reduced-motion support. |
| Imagery | Full-bleed, editorial landscapes with a dark, low-opacity gradient that preserves text contrast. |

## Hero Carousel

The hero uses three popular, visually differentiated locations: **Cape Town**, **Kyoto**, and **Amalfi Coast**. Each slide gives the guest a compact reason to explore, a direct CTA that starts a location search, accessible manual controls, and a labelled indicator. The search rail stays visually anchored over the imagery, so the carousel supports—not replaces—the primary booking interaction.

| Slide | Headline | Supporting copy | Primary action |
|---|---|---|---|
| Cape Town | Mountains in the morning. Ocean by lunch. | Find bright, design-led stays from the City Bowl to the coast. | Explore Cape Town |
| Kyoto | A slower way to arrive. | Wake near quiet temples, garden paths, and neighbourhood cafés. | Explore Kyoto |
| Amalfi Coast | A view worth taking the long way for. | Stay above the sea, with small towns and late dinners nearby. | Explore Amalfi Coast |

## User Journeys

### 1. Guest: Discover, compare, and reserve

A guest enters through the destination-led home screen, either uses the persistent search rail or chooses a hero destination. Search results immediately clarify the location, number of stays, nightly price, rating, and highlights. Selecting a result opens an immersive, image-first listing view. The guest can verify the host, amenities, rules, review signals, safety information, and cancellation policy before selecting dates and guest count. The reserve panel gives a transparent itemised total, and its response language confirms either the next required action or the completed reservation.

### 2. Host: List, monitor, and act

A host signs in and is routed directly to a focused dashboard rather than the public home page. The dashboard surfaces three decisions first: create a listing, review current listings, and see new/upcoming reservations. Listing forms use plain labels, supportive validation, and a clear save outcome. Reservation views prioritise guest, date range, total, and status, enabling a host to understand what needs attention without scanning dense administrative UI.

### 3. Administrator: Maintain trust and system quality

An administrator signs in through the same protected entry point but receives administrator-specific navigation. The first screen provides aggregate listing, reservation, and earnings signals. Manage Listings, Users, and Reservations are each one decision away. User-role updates are explicit and safeguarded: status confirmation explains the change, while the administrator's own admin role cannot be removed. The tone emphasises responsible oversight instead of technical jargon.

| State | Tone principle | Example |
|---|---|---|
| Welcome | Inviting and specific | “Find a place that feels like the trip.” |
| Search | Clear and practical | “24 stays in Cape Town” |
| Booking confirmation | Reassuring, not celebratory | “Your request is confirmed. We’ll keep the details here.” |
| Form validation | Helpful and actionable | “Choose a checkout date after your check-in.” |
| Empty state | Forward-looking | “No trips booked yet. Your next stay starts with a search.” |
| Admin/host actions | Direct and accountable | “Role updated to Host.” |

## Accessibility and Responsive Behaviour

The solution will preserve legible contrast over photography, provide descriptive alternative text, retain keyboard-operable buttons, menus, gallery controls, and search actions, and expose the slide position to assistive technology. At mobile widths, the header search rail becomes a stacked touch target, the hero text sits below the image focal point, carousel controls remain reachable, cards move to one column, and the reservation panel follows the listing content instead of relying on sticky positioning.

## Reference

- Supplied project brief: `/home/ubuntu/upload/pasted_content.txt`
- Reference design: [Airbnb – Home, Search, and Listing Pages](https://www.figma.com/design/BR5wBtTc3VPFiuvyYS1zN9/Airbnb---Home%2C-Search%2C-and-Listing-Pages)
