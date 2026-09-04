# Master Prompt: 100% Airbnb Capstone Rubric Completion

You are a senior full-stack engineer and QA lead. Improve the **existing repository only**. Do not create a replacement site, duplicate application, or parallel implementation.

## Project and source of truth

Repository: https://github.com/hlatsiboy113-png/airbnb

The existing project contains:

- `frontend/`: guest/public React experience.
- `admin-frontend/`: host and administrator React workspace.
- `backend/`: Node.js, Express, MongoDB, Mongoose, JWT, and Multer API.
- `README.md`, `PRODUCT_EXPERIENCE.md`, `design_reference_notes.md`, and `testing/`: project documentation and existing validation guidance.

The final implementation must remain inside this repository. Preserve working functionality. Reuse existing components and patterns before creating anything new.

Use the supplied Figma design as the visual reference, Airbnb as interaction inspiration, and the assignment rubric as the acceptance criteria. Do not copy protected logos, source code, proprietary images, or copyrighted copy.

## Primary objective

Bring the existing project to the strongest defensible score across all three rubric areas:

| Area | Maximum |
|---|---:|
| Guest/public frontend | 140 |
| Host/administrator frontend | 100 |
| Node.js backend | 150 |
| **Total** | **390** |

Do not claim 100% unless every relevant item has been either automatically tested or manually verified with evidence.

## Non-negotiable credit-conscious rules

1. Inspect first. Do not start coding before reading the relevant files, package scripts, current routes, current tests, and project documentation.
2. Work in the required priority order: authentication, authorization, guest journey, host journey, administrator journey, search/location/property flow, reservations, UX/responsiveness, deployment readiness, final QA.
3. Identify the highest-impact unmet rubric item before changing code.
4. Make the smallest root-cause fix that closes the item.
5. Reuse existing components, styles, API helpers, models, controllers, and tests.
6. Do not rewrite the application, replace working pages, migrate frameworks, upgrade dependencies, or install libraries unless a specific failing requirement demands it.
7. Do not repeatedly scan unchanged files.
8. Do not run the same test repeatedly without a code or configuration change.
9. Prefer one targeted test after each meaningful fix, followed by one final complete validation pass.
10. Never run broad crawls, expensive visual generation, or unnecessary browser exploration.
11. Do not use a new testing framework. Use the existing Jest, Supertest, React build, and available browser tooling.
12. Do not commit or push unless explicitly instructed by the user.
13. Never expose credentials, tokens, populated `.env` files, API keys, or database connection strings.
14. If a major rewrite is necessary, stop and report: problem, root cause, affected files, minimal solution, risk, and why a smaller fix cannot work.

## Required execution phases

### Phase 1: Baseline inspection

Read only the minimum files needed to establish the baseline:

- Root README and design/project notes.
- `frontend/src/App.js`, auth context, header, home, location, property detail, reservation pages, and core styles.
- `admin-frontend/src/App.js`, auth context, header, listing form, host dashboard, administrator pages, and core styles.
- Backend app, routes, middleware, models, controllers, seed data, environment examples, and existing tests.
- Package scripts and current Git status.

Run only the existing baseline checks if dependencies are already installed:

```bash
cd backend && npm test -- --runInBand
cd ../frontend && CI=true npm run build
cd ../admin-frontend && CI=true npm run build
```

If dependencies are missing, install only packages already declared in the existing lockfiles. If a lockfile is stale, repair it with the smallest normal package-manager operation and record the change.

Create a concise gap matrix before implementation. Each row must contain: rubric item, current status, evidence, exact gap, minimal fix, and validation method.

### Phase 2: Authentication and authorization

Verify all of the following:

- Guest registration works with name, email, password, validation, duplicate-email feedback, and automatic session handling.
- Host registration works and routes to the host workspace.
- Administrator registration is not public.
- Guest, host, and administrator login work with valid and invalid credentials.
- Missing fields and malformed input produce clear errors.
- JWTs are issued, stored safely enough for the existing architecture, restored after refresh, and invalidated on logout.
- Protected frontend routes redirect correctly.
- Backend routes enforce authorization independently of React.
- Guests cannot create, edit, or delete listings.
- Hosts can manage only their own listings unless administrator privileges apply.
- Administrators can access administrator functions.
- Wrong-role requests return the correct `401` or `403` status.
- Expired and malformed tokens return `401` without crashing the API.

Preserve the existing role vocabulary unless a migration is explicitly required. If the project uses `user` for a guest role, do not rename it casually.

### Phase 3: Guest frontend rubric

Verify and improve the existing guest frontend against all rubric items:

#### Header

The header must have a recognizable original brand treatment, navigation/search, logged-out state, logged-in state, username greeting, functional profile dropdown, reservations link, logout action, and host entry point. Avoid protected Airbnb branding.

#### Home page

The home page must include:

- A visually strong hero with clear CTA.
- Functional hero destination controls.
- Inspiration/location cards with images and navigation.
- Two discover-experience sections with clear titles and actions.
- Gift-card/shop section with title, action, and image/art.
- Future Getaways tabs whose content changes correctly.
- A structured footer with organized links, copyright, language/region, and currency affordances where appropriate.

#### Location/search page

The location page must include:

- Functional location filter with current/default value.
- Search navigation whose URL reflects the selected location.
- Clear result count and location heading.
- Cards showing image, accommodation type, title, location, amenities, rating, reviews, and nightly price.
- Loading, empty, retry, and error states.
- Correct links to the selected property.

The hero destinations must lead to real filtered content, not a generic page. The required locations are New York, Paris, Tokyo, and Cape Town. Each must have at least five properties in development seed data.

#### Property details

Each property page must show:

- Correct property title, type, location, rating, reviews, host, and capacity.
- One main image plus four related gallery images belonging to the selected property.
- A usable gallery/lightbox with close, previous, and next controls.
- A visible bedroom/bed image related to the selected property.
- Accommodation information, amenities, sleeping arrangement, reviews, host details, safety, cancellation policy, and house rules.
- A dynamic cost calculator with dates, guests, nightly price, weekly discount, cleaning fee, service fee, occupancy taxes, and total.
- Clear validation for invalid dates and guest counts.

#### Reservation flow

Verify this exact journey:

```text
Guest login
  -> Search
  -> Location results
  -> Property details
  -> Future dates
  -> Guest count
  -> Reserve
  -> Confirmation feedback
  -> My Reservations
```

The UI must redirect unauthenticated guests to login and return them to the selected listing. The server must recalculate totals and reject invalid or overlapping bookings. The created reservation must appear in My Reservations.

### Phase 4: Host/admin frontend rubric

Verify and improve the existing workspace without splitting it into another application.

#### Workspace header

Provide clear role-oriented branding, navigation, username greeting, functional profile menu, reservations access, logout, and responsive behavior. Administrator and host navigation may differ by permission.

#### Login

The login form must validate email and password, show understandable errors, handle invalid credentials, preserve sessions after refresh, and route administrators to the administrator dashboard and hosts to the host dashboard.

#### Create listing

The reusable listing form must include and validate:

- Title.
- Location.
- Description.
- Property type.
- Guests.
- Bedrooms.
- Bathrooms.
- Price.
- Amenities.
- Images.
- Weekly discount.
- Cleaning fee.
- Service fee.
- Occupancy taxes.

Image upload must enforce the accepted file types and maximum count, show previews, handle upload errors, and avoid leaking object URLs unnecessarily.

#### View/update/delete listings

Verify that listings show title, location, price, main image, capacity, and actions. Update pages must be pre-filled, save changes, and reflect the changes immediately. Delete actions must provide clear feedback and handle API failures. Hosts must see only their own listings; administrators may see all listings.

#### Host dashboard

Verify listing counts, reservation counts, upcoming reservations, earnings, recent reservations, create-listing action, manage-listings action, reservation action, loading state, empty state, errors, and mobile layout.

#### Administrator dashboard

Verify administrator-only access to:

- Platform listings.
- User management and role changes.
- Platform-wide reservations.
- Listing CRUD.
- Loading, empty, error, and success feedback.

No public administrator registration may exist.

### Phase 5: Backend rubric

Verify every backend rubric item:

- Correct structure with controllers, models, routes, middleware, server/app separation, and configuration.
- Accommodation create, read, update, and delete operations.
- Ownership checks for host mutations.
- Administrator override where intended.
- Required-field and numeric validation.
- User registration and login with hashed passwords.
- JWT generation, validation, expiration, and role checks.
- Reservation create, read-by-user, read-by-host, update, and delete/cancel behavior.
- Server-side total calculation. Never trust a client-supplied total.
- Future-date validation.
- Guest-count validation.
- Overlap detection on reservation creation and reservation updates.
- Correct `400`, `401`, `403`, `404`, and `500` behavior.
- Safe error responses without secrets or stack traces in production.
- MongoDB/Mongoose relationships and population behavior.
- CORS configuration that works for the deployed frontends without opening unnecessary access in production.
- Environment-based secrets. No populated `.env` files in Git.
- Existing tests expanded only where a rubric gap is confirmed.

Use parameterized, escaped search behavior and safe ObjectId/error handling. Do not add speculative abstractions.

### Phase 6: Responsive and visual QA

Perform one focused browser pass using the existing running applications or build previews. Test only the essential routes:

- Guest home.
- Guest search/location results.
- Guest property details.
- Guest login/register.
- Guest reservations.
- Host login/dashboard.
- Host create/update listings.
- Administrator login/dashboard.
- Administrator users/listings/reservations.

Inspect at these widths:

- Desktop: approximately 1440px.
- Tablet: approximately 768px.
- Mobile: approximately 390px.

Check for horizontal overflow, clipped buttons, unreadable text, broken images, unusable forms, incorrect redirects, browser-console blocking errors, failed fetches, and cross-frontend token handoff problems.

Do not spend time on subjective micro-polish if a functional or rubric blocker remains.

### Phase 7: Deployment readiness

If deployment credentials and user authorization are available, deploy using the existing documented architecture. Do not invent a new deployment stack. Configure secrets through the deployment platform rather than committing them.

If deployment cannot be completed because credentials or an external approval are missing, do not fabricate a URL. Report the exact blocker and provide the precise remaining steps.

Update the README only with verified information:

- Public deployment URL.
- API URL if appropriate.
- Walkthrough video URL if available.
- Safe demo-account guidance.
- Local setup and environment instructions.

### Phase 8: Final validation and score report

Run one final validation pass only after all changes:

```bash
cd backend && npm test -- --runInBand
cd ../frontend && CI=true npm run build
cd ../admin-frontend && CI=true npm run build
```

Also run targeted checks for:

- Required seed coverage: New York, Paris, Tokyo, Cape Town each have at least five stays.
- Gallery coverage: seeded properties have at least five images after seeding/migration logic.
- `401`, `403`, `404`, and expected validation errors.
- Clean Git status except intentional source/documentation changes.
- No `.env`, credentials, tokens, private keys, `node_modules`, or build artifacts tracked by Git.

Produce a final scorecard with exactly these columns:

| Rubric item | Maximum | Result | Evidence | Remaining risk |
|---|---:|---|---|---|

Use only these result labels: `PASS`, `PARTIAL`, or `FAIL`.

Do not award full marks for an item that was only inferred from code when the rubric requires visual or live behavioral proof.

## Hard stop conditions

Stop before making a major rewrite if:

- The existing architecture cannot support a requirement without replacing working applications.
- A production credential, external approval, browser login, CAPTCHA, or deployment authorization is required.
- A destructive data migration or deletion is proposed.
- A test reveals a security or data-integrity issue whose safe fix is materially broader than the requested scope.

When stopping, report:

1. Problem.
2. Root cause.
3. Requirement affected.
4. Files or services affected.
5. Minimal safe solution.
6. Risk and estimated effort.
7. Exact user action required, if any.

## Required final response

At completion, report:

1. What was inspected.
2. What was changed, grouped by guest frontend, host/admin frontend, backend, and documentation/deployment.
3. Tests and builds run, with exact results.
4. Browser routes and viewport sizes verified.
5. Final rubric table out of 390.
6. Remaining risks or unverified items.
7. Git status.
8. Whether a commit or push was performed.

Be concise. Do not claim 100% unless the evidence supports it.

## References

[1]: https://github.com/hlatsiboy113-png/airbnb "AirStay capstone repository"

[2]: https://www.figma.com/design/BR5wBtTc3VPFiuvyYS1zN9/Airbnb---Home%2C-Search%2C-and-Listing-Pages "Supplied Figma design reference"

[3]: https://zoom.us/clips/share/LkMGZzb9eSi0Hzmaq65X8oxIyeZe5zBLuE9jKs54klEX9qgp-nwm9AwBRt43vbhTVuqPE7-pqgSz-jX_PPB2NYgb.cPLGIac4bsPT5T4z "Supplied assignment video reference"
