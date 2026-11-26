# Datanalyst

Ask your data a question. You upload one or more CSV files, optionally add a CMIP6 climate context (WorldClim v2.1), and a Gemini agent writes a report: key figures, charts and recommendations.

## Running locally

```bash
npm ci
cp .env.example .env.local   # then fill in GEMINI_API_KEY
npm run dev                  # http://localhost:3000
npm test                     # rate-limit tests
npm run lint                 # TypeScript check
npm run build && npm start   # production mode
```

## Gemini budget protection

Each analysis consumes the Gemini API key. Before this version, nothing was limited: the quota was keyed on a constant (`"dev-user-hash"`) and never applied to `/api/analyze`. Now:

| Protection | Default | Variable |
|---|---|---|
| Analyses per day and per visitor | 20 in production, unlimited in development | `DAILY_QUOTA_LIMIT` |
| Requests per minute and per visitor (`/api/analyze`, `/api/upload`) | 5 | `BURST_LIMIT_PER_MINUTE` |

Visitors are identified by a salted hash of their IP address (`QUOTA_SALT`); IP addresses are never stored in clear. Counters live in `.data/`, which is not served and is ignored by git.

Other fixes:
- only chart images in `output/` are served (the whole folder was public before, quota file included);
- `/api/download-proxy` was removed (unused, it relayed any public file).

## Interface

- **Layout:** the 3 steps on the left and a sticky summary on the right, with the launch button always visible (pinned to the bottom of the screen on mobile).
- **Climate context:** optional and collapsed by default.
- **Colour tokens** in `src/index.css`. Mineral background, slate ink, "survey" blue for actions. The Tailwind palettes used throughout the code (`neutral`, `blue`…) are remapped there, so the whole theme can be changed from a single file.
- **Light and dark themes** consistent everywhere. The dark theme reverses the neutral scale instead of piling up `dark:` classes (it was broken before: unreadable text in the climate section).
- **Warming stripes** in the header, following the selected SSP scenario. This is a smoothed illustration: IPCC AR6 best estimates for 2081-2100, not measurements.
- **Typography:** IBM Plex Sans, Plex Sans Condensed for headings, Plex Mono for WorldClim identifiers.
- **Language:** French by default (browser detection retained), English available.
- **Accessibility:** secondary text contrast ≥ 4.5:1, skip link, visible focus, reduced motion respected.

## Known limitations (to be addressed)

- **Climate map images are placeholders.** The images in `src/assets/images/` are not computed from WorldClim data, and the interface now labels them as illustrations. Some overlaid figures should be checked against IPCC AR6, for example "Global Mean +2.4 to +3.0 °C" for SSP2-4.5 in 2041-2060 (**unverified**).
- **Partial translation:** several labels in the climate section are still English only.
- **The report screen** (after an analysis) inherits the new tokens but has not been checked visually: that requires a Gemini key.
