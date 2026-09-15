# RTTEST / evidence / screenshots — collection point

This is where genuine, captured evidence images belong. Organised by screen
role/flow:

```
screenshots/
├── guest/           G01–G06  (guest frontend captures)
├── host/            H01–H07  (host workspace captures)
├── admin/           A01–A03  (administrator workspace captures)
├── reservations/    booking-flow captures (guest + host views)
├── responsive/      R01–R03  (1440 / 768 / 390 px captures)
├── authentication/  login/register/role-routing captures
└── unclassified/    unknown-source images awaiting identification (see unclassified/README.md)
```

Rules:

1. Only real captures go here — never fabricated/pasted/edited-to-look-real
   images.
2. Record every capture in `../screenshot-register.md` and in `manifest.md`.
3. Name files `ID-description-viewport.png` (e.g. `G01-home-desktop-1440.png`).
4. Never include credentials in filenames or captions.
5. If a screenshot's origin is unclear, put it in `unclassified/` and document
   why.

Current status: **empty — no genuine project screenshots exist yet.** See
[`../screenshot-register.md`](../screenshot-register.md).