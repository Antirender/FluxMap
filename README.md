# FluxMap вЂ” Real-time News Heatmap

FluxMap turns the global firehose of news media into a living, interactive map. It pulls articles from multiple news APIs, geocodes them, and renders the result as a deck.gl + MapLibre heatmap with linked views for trends, top locations, and article evidence.

A **multi-source provider chain** (NewsData.io в†’ Guardian в†’ GDELT в†’ cache в†’ demo) ensures resilient data delivery вЂ” if one source is down, the next one takes over automatically.

Built for **VDES 39915 вЂ” Visualizing Information: Dynamic Data Models (Project 2)** at Sheridan College.

---

## What it does

FluxMap answers one question in a visually rich way:

**"Where is the world's news happening right now вЂ” and how is it changing over time?"**

* A **global heatmap + event dots** map view (deck.gl)
* A **trend sparkline** showing volume over time
* A **top locations** ranked list with mini bars
* An **article evidence** panel with headlines, sources, and thumbnails

---

## Features

| Feature | Details |
|---|---|
| **Time windows** | 15 min В· 1 hr В· 6 hr В· 24 hr В· 7 day |
| **Multi-view linking** | Map, trend, top-list, and articles all tied to the same state |
| **Auto-refresh** | Explore page re-fetches every 60 s with a Last Updated indicator |
| **Story mode** | Scrollytelling onboard| **Story mode** | Scrollytelling onboard| **Story mode** | Scrollytelling onboard| **Story mode** | Scrollytelling onboard| **Story mode** | Scrollytelling onboard| **Story mode** | Srovider chain guarantees data on every load |
| **Dark / light UI** | CSS-variableвЂ“driven theme adaptation |

---

###############Story** вЂ” scrollytelling guided tour (static data, zero API dependency)
2. **Explore** вЂ” main interactive dashboard (linked views + auto-refresh)
3. **About** вЂ” methods, data sources, limitations, and tech stack

---

## Data sources (provider ch## Data sources (provider ch## Data sourcestil on## Data sources (provider ch## Data sources (provider ch## Data source*NewsDat## Data sLate## Data sources (proca## Data il## Data sources (provider ch## Data sources (provider ch## h across Guardian content |
| 3 | **GDELT Project** | Geo-coded media mentions (GEO 2.0 + DOC 2.0) |
| 4 | **localStorage cache** | 30-minute TTL; serves stale data when all APIs fail | 4 | **localStorage cache** | 30-minute TTL; serves stale data when all APIs fail | 4 | **localStorage cache** | 30-minute TTL; serves stale data when all APIs fail | 4 | **localStorage cache** | 30-minute TTL; serves stale data when all APIs fail | 4 | **localStoragd G| 4 | **localStorage cache** | 30-minute TTL; serves stale d~150+ citie| 4 | **localStorage cache** | 30-minute TTL; serves stale data when all APIs fail | 4 aching

* **Auto-refresh**: Explore page re-fetches every 60 seconds
* **Serverless proxies**: `/api/*` functions set `Cache-Control: s-maxage=300` for * **Serverless proxies**: `/api/*` functions set `Cache-Control: s-maxage=300` for * **Serverless proxies**: `/api/*` functions set `Cache-Control: s-maxage=300` for * **Serverless proxies**: `/api/*` functions set `Cache-Control: s-maxage=300` for * **Serverless proxies**: `/api/*` f 7* **Serverless proxies**: `/api/*` functions set `Cache-Control: s-maxain* **Serverless proxies**: `/api/*` functions set `Cache-Control: s-maxage=300` for * **Serverless proxies**: `/api/*` functions set `Cache-Control: s-maxage=300` for * **Serverless proxies**: `/api/*` functions set `Cache-Control: s-maxage=300` for * **Serverless proxies**: `/api/*` functions set `Cache-Control: s-maxage=300` for * **Serverless proxies**: `/api/*` f 7* **Serverless proxies**: `/api/*` functions set `Cache-Control: s-maxain* **Serverless proxies**: `/api/*` functions set `Cache-Control: s-maxage=/
ввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaввввввввввввввввввввввввввввввввввввввввввввввввввввввввввввzaвввввввввввввввввввввввввввввв

)### Install

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root (**do not** use the `VITE_` prefix вЂ” keys must stay server-side):

```env
NEWSDATA_API_KEY=your_newsdata_api_key
GUARDIAN_API_KEY=your_guardian_api_key
```

> **Important**: These keys are only read by the serverless functions in `/api/`. They are never bundled into the browser build.

### Local development

Use `vercel dev` (not `npm run dev`) so the serverless proxy functions work locally:

```bash
vercel dev
```

This starts the Vite dev server **and** the `/api/*` serverless functions. Open [http://localhost:3000](http://localhost:3000).

> `npm run dev` still works for front-end-only development, but API proxy calls will fail and the app will fall through to cache / demo data.

### Build for production

```bash
npm run build
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in Vercel
3. Add environment variables in Vercel dashboard:
   * `NEWSDATA_API_KEY`
   * `GUARDIAN_   * `GUAR. Build command: `npm run bu   * `GUARDIAN_   * `GUA: `   * `GUARDIAN_   * `GUAR. Build command: `npm run bu   * `GUARDIAN_   * `GUA: `   * `GUARDIAN_   * `GUAR. Builn tim  uts and URL rewrites.

---

## Browser support

* Chrome / Edge (recommended)
* Firefox
* Firefox
 Edge (recommended)
ld command: `npm run bu   * `GUARDIAN_   * `GUA: `   * `GUARDIAN_   * `GUAR. Build command).
Data poData poData poData pio*Data poData poData poData pio*Data poData poData poData pio*Data poData poData poDaors**.
MadeMadeMaderender
