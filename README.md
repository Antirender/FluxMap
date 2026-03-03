# FluxMap — Real-time News Heatmap

FluxMap turns the global firehose of news media into a living, interactive map. It pulls articles from multiple news APIs, geocodes them, and renders the result as a deck.gl + MapLibre heatmap with linked views for trends, top locations, and article evidence.

A **multi-source provider chain** (NewsData.io → Guardian → GDELT → cache → demo) ensures resilient data delivery — if one source goes down, the next one takes over automatically. Users can also **pin a preferred source** via the toolbar's source switcher.

Built for **VDES 39915 — Visualizing Information: Dynamic Data Models (Project 2)** at Sheridan College.

---

## What it does

FluxMap answers one question in a visually rich way:

> **"Where is the world's news happening right now — and how is it changing over time?"**

- A **global heatmap + event dots** map view powered by deck.gl
- A **trend sparkline** showing article volume over the selected time window
- A **top locations** ranked list with mini bar charts
- An **article evidence** panel with headlines, sources, and thumbnails

---

## Features

| Feature | Details |
|---|---|
| **8 topic channels** | Protest · Wildfire · Earthquake · Flood · Cyber · Health · Economy · Elections |
| **Time windows** | 15 min · 1 hr · 6 hr · 24 hr · 7 day |
| **Free-text search** | Filter articles and map dots by any keyword |
| **Multi-view linking** | Map, trend, top-list, and articles share the same state |
| **Auto-refresh** | Explore page re-fetches every 60 s with a Last Updated indicator |
| **Source switcher** | Pin a preferred data source — Auto / NewsData.io / Guardian / GDELT / Demo |
| **Onboarding tour** | 5-step guided tour on first visit; re-launchable from the source menu |
| **Story mode** | Scrollytelling narrative (static data, zero API dependency) |
| **Multi-source resilience** | 5-layer provider chain guarantees data on every load |
| **Dark / light UI** | CSS custom property–driven theme |

---

## Pages

1. **Story** — scrollytelling guided tour of a live news event
2. **Explore** — main interactive dashboard (linked views, auto-refresh, source switcher)
3. **About** — data sources, methods, limitations, and tech stack

---

## Data sources (provider chain)

| Priority | Source | Notes |
|---|---|---|
| 1 | **NewsData.io** | Primary live source; 200 credits/day free tier |
| 2 | **The Guardian** | Open Platform API; generous free tier |
| 3 | **GDELT Project** | Geo-coded media mentions (GEO 2.0 + DOC 2.0) |
| 4 | **localStorage cache** | 30-minute TTL; serves stale data when all APIs fail |
| 5 | **Demo data** | Curated articles with real URLs; offline fallback |

The automatic chain tries each source in order. Users can override it and pin any source via the **Source** button in the Explore toolbar.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 · TypeScript 5 · Vite 7 |
| Mapping | deck.gl 9 · MapLibre GL 5 |
| State | Zustand 5 |
| Routing | React Router 7 |
| Scrollytelling | react-scrollama |
| Hosting | Vercel (Edge CDN + Serverless Functions) |
| Styling | Plain CSS + CSS custom properties (dark / light) |

---

## Getting started

### Install

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root. **Do not** use the `VITE_` prefix — these keys must stay server-side:

```env
NEWSDATA_API_KEY=your_newsdata_api_key
GUARDIAN_API_KEY=your_guardian_api_key
```

> Keys are only read by serverless functions in `/api/`. They are never bundled into the browser build.

### Local development

Use `vercel dev` so the serverless proxy functions work:

```bash
vercel dev
```

Opens [http://localhost:3000](http://localhost:3000) with the Vite dev server **and** `/api/*` functions running side-by-side.

> `npm run dev` also works for front-end–only development, but API calls will fall through to cache / demo data.

### Build for production

```bash
npm run build
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in the Vercel dashboard
3. Add environment variables:
   - `NEWSDATA_API_KEY`
   - `GUARDIAN_API_KEY`
4. Build command: `npm run build` · Output directory: `dist`
5. `vercel.json` handles URL rewrites and cache headers automatically.

---

## Caching strategy

| Layer | TTL / detail |
|---|---|
| Vercel Edge cache | `s-maxage=300, stale-while-revalidate=600` on all `/api/*` responses |
| Browser localStorage | Per-channel + per-time-window cache with 30-minute TTL |
| Story page | Fully static — bundled at build time, zero network calls |

---

## Browser support

Chrome / Edge · Firefox · Safari 17+

---

Made by **antirender** · © 2026 FluxMap · VDES 39915 at Sheridan College
