# FluxMap — News Heatmap (Real-time News Radar)

FluxMap is a sophisticated, product-style news heatmap that turns the global firehose of media into a living map. It pulls geo-tagged media mentions from the GDELT Project, clusters them by location and topic, and renders the result as an interactive deck.gl + MapLibre visualization with linked views for trends, top locations, and article evidence.

Built for **VDES 39915 — Visualizing Information: Dynamic Data Models (Project 2)** at Sheridan College.

---

## What it does

FluxMap answers one simple question in a visually rich way:

**“Where is the world’s news happening right now — and how is it changing over time?”**

It does this using:

* A **global heatmap + event dots** map view
* A **trend sparkline** (timeline volume)
* A **top locations list** (with mini bars)
* An **article evidence panel** (source, time, thumbnail, headline)

---

## Features

### Time window switching

Switch between multiple time windows to see how attention shifts:

* **15 min**
* **1 hr**
* **6 hr**
* **24 hr**
* **7 day** (included in the current build)

### Multi-view linking

All views are linked to the same state (channel, time window, keyword search):

* **Map**: deck.gl HeatmapLayer + ScatterplotLayer over MapLibre basemap
* **Trend**: DOC 2.0 TimelineVol rendered as an SVG sparkline
* **Top Locations**: ranked list with small bar indicators
* **Articles**: DOC 2.0 ArtList “evidence” cards (title, source, image when available)

### Auto-refresh + Last updated

* Explore page automatically refreshes data every **60 seconds**
* A **Last Updated** indicator shows the most recent refresh timestamp

### Story mode (scrollytelling)

A narrative **Story** page uses scrollama-driven steps to:

* switch channel/time window
* re-query data
* guide the viewer through different “world lenses” (e.g., protests, disasters, cyber)

### Map layer controls

A compact ⚙ panel (top-left) allows:

* toggle **heatmap** / **scatter dots**
* choose heatmap palettes (Channel / Thermal / Green / Plasma)
* adjust **radius** and **intensity** sliders

### Dark / light mode friendly UI

* UI elements adapt via CSS variables
* tooltips and controls adapt automatically

---

## Pages

1. **Story** — scrollytelling experience (react-scrollama)
2. **Explore** — main interactive dashboard (linked views + auto-refresh)
3. **About** — methods & transparency (data source, cadence, limitations, tech stack)

---

## Data source

FluxMap uses the **GDELT Project** (public APIs; no account required). Two endpoints power the app:

* **GEO 2.0 API**: geo-coded mention points returned as GeoJSON
  Each point represents a location referenced in matching news coverage, often with a **count**.

* **DOC 2.0 API**:

  * **ArtList** for article evidence cards
  * **TimelineVol** for the trend sparkline

Notes:

* GDELT updates frequently (often around ~15-minute cycles depending on collections).
* Geo-coding is NLP-based: some points can be imprecise (centroids, ambiguous place names).
* Volume ≠ importance: high counts can reflect coverage density, not event severity.

---

## Refresh cycle & caching

* **Explore auto-refresh** re-fetches data every **60 seconds**
* The data layer includes caching to avoid redundant network work when switching quickly
* DOC timeline requests are paced to avoid throttling (with retry if empty results occur)

If you’re deploying on Vercel, the recommended “product” approach is:

* use `/api` serverless endpoints as a proxy
* set `Cache-Control` headers for edge caching (fast switches + fewer upstream hits)

---

## Tech stack

* **Frontend**: React + TypeScript + Vite
* **Mapping**: deck.gl + MapLibre GL
* **State**: Zustand
* **Routing**: React Router
* **Scrollytelling**: react-scrollama
* **Styling**: plain CSS (component-scoped files)

---

## Project structure

```
FluxMap/
├── src/
│   ├── components/          # reusable UI + visualization components
│   ├── pages/               # Story / Explore / About
│   ├── data/                # channels + GDELT API wrappers
│   ├── store.ts             # global state + refresh orchestration (Zustand)
│   ├── types.ts             # core types (GeoFeature, GdeltArticle, TimelinePoint...)
│   ├── App.tsx              # routes + app-level wiring
│   └── main.tsx             # entry
├── public/
├── vite.config.ts
├── package.json
└── README.md
```

---

## Getting started

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open:

* [http://localhost:5173/](http://localhost:5173/)

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Deployment (Vercel)

Recommended:

1. Push to GitHub
2. Import the repo in Vercel
3. Build command: `npm run build`
4. Output directory: `dist`

If you’re using serverless API routes for proxy/caching, keep them under `/api` in the repo so Vercel deploys them automatically.

---

## Browser support

* Chrome / Edge (recommended)
* Firefox
* Safari
  Requires **WebGL** support.

---

## License

MIT

---

## Credits

Built for **VDES 39915** (Sheridan College).
Powered by **GDELT** (public data). Basemap by **MapLibre + OpenStreetMap contributors**.
Made by Antirender
