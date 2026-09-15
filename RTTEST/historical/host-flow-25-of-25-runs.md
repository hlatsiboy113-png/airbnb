# Host-flow E2E: 25/25 PASS × 3 runs (historical claim)

- **Source:** current (working-tree) `RENDER_REDEPLOY.md` records
  "Host-flow E2E vs live Atlas data shape: `25/25` PASS (3 consecutive runs)".
- **Status:** HISTORICAL / NOT CURRENTLY REVERIFIED.
- **Why:** the repository contains **no E2E harness** (no Cypress, Playwright,
  Puppeteer, or `e2e/` scripts) and no raw output, log, script, or screenshots
  for those runs were committed. The claim describes a browser-driven pass that
  was performed outside the repository and cannot be re-executed here as-is.
- **What the claim covered (from the source doc):** a host-flow journey —
  host login → dashboard reachable → host create listing → update listing →
  host reservation view — against the live production API.
- **Honest labelling for assessment:** the run is evidence that the host flow
  *was* verified in production at that time, but it is **not** independently
  reproducible evidence today. The rerunnable equivalent is the automated
  backend suite (51/51, current) plus the live 401/403 guard checks and a manual
  host-flow walk (see [`../e2e/index.md`](../e2e/index.md) and
  [`../evidence/screenshot-checklist.md`](../evidence/screenshot-checklist.md)).