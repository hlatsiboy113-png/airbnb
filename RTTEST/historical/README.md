# RTTEST / historical — Earlier verification records

Everything in this folder is a **documented claim from earlier in the project's
life**. It is preserved for provenance. It is **not** a substitute for current
evidence. Where a claim has since been re-verified, that is stated and the
current result lives in [`../results/`](../results/README.md).

Legend: **HISTORICAL** = recorded earlier, not reproducible today without
extra tooling/data. **RE-VERIFIED** = matched by a 2026-09-15 run in this
environment.

| Record | Source | Status |
|---|---|---|
| [`backend-40-of-40.md`](backend-40-of-40.md) | `DEPLOYMENT_QA_REPORT.md` (committed 2026-09-04) | HISTORICAL |
| [`backend-44-of-44.md`](backend-44-of-44.md) | committed `RENDER_REDEPLOY.md` (`HEAD`) | HISTORICAL |
| [`backend-51-of-51.md`](backend-51-of-51.md) | working-tree `RENDER_REDEPLOY.md` | RE-VERIFIED (2026-09-15) |
| [`host-flow-25-of-25-runs.md`](host-flow-25-of-25-runs.md) | working-tree `RENDER_REDEPLOY.md` | HISTORICAL — no committed harness/output |

Timeline (reconstructed from git history):
1. **2026-09-01** — patch `0003-test-backend-add-mocked-Jest-Supertest-suite.patch`
   (6831 lines) added in commit `2575483` ("test: complete second-pass backend
   verification"); removed 2026-09-04 (`3eeb5be`).
2. **2026-09-04** — `DEPLOYMENT_QA_REPORT.md` records **40/40** backend PASS
   ("Final Report" table) at `2346ce4`.
3. **2026-09-05** — committed `RENDER_REDEPLOY.md` records **44/44** backend PASS.
4. **2026-09-05** — working-tree `RENDER_REDEPLOY.md` records **51/51** backend
   PASS and the host-flow E2E **25/25 × 3 runs**.
5. **2026-09-15** — this environment re-runs the backend suite: **51/51 PASS**
   (matches the later claim). The E2E 25/25 claim is **not** reproducible here —
   no E2E harness exists in the repository.