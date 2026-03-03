/**
 * Unified multi-source data provider chain
 *
 * Architecture (5 layers):
 *
 *   Layer 1 — NewsData.io (primary live source)
 *             Calls https://newsdata.io directly from the browser.
 *             Set VITE_NEWSDATA_API_KEY in .env.local (free, 200 req/day).
 *
 *   Layer 2 — The Guardian Open Platform
 *             Completely free, no-key access via 'test' key.
 *             Set VITE_GUARDIAN_API_KEY for a higher-rate personal key.
 *
 *   Layer 3 — GDELT (great when up, geo-native)
 *             Falls back silently if server is unreachable.
 *
 *   Layer 4 — localStorage persistent cache (30-min TTL)
 *             Last successful result per channel+timeWindow.
 *
 *   Layer 5 — Demo / static data (always available)
 *
 * The Explore page calls `fetchAllData()` which tries each layer
 * in order and returns the first successful result.
 *
 * Required env vars (in .env.local for dev, Vercel dashboard for prod):
 *   NEWSDATA_API_KEY   — from newsdata.io (no VITE_ prefix; server-side only)
 *   GUARDIAN_API_KEY    — from open-platform.theguardian.com (server-side only)
 *
 * Keys are kept server-side in Vercel serverless functions (/api/newsdata,
 * /api/guardian). The browser never sees them.
 * For local dev, run `vercel dev` instead of `npm run dev`.
 */

import type { TimeWindow, GeoFeature, GdeltArticle, TimelinePoint, TopLocation } from '../types';
import {
  fetchGeoData as gdeltFetchGeo,
  fetchArticles as gdeltFetchArticles,
  fetchTimeline as gdeltFetchTimeline,
  deriveTopLocations,
} from './gdeltApi';
import {
  getDemoGeo,
  getDemoArticles,
  getDemoTimeline,
  getDemoTopLocations,
} from './demoData';

/* ================================================================== */
/*  Unified result type                                                */
/* ================================================================== */

export interface DataResult {
  geo: GeoFeature[];
  articles: GdeltArticle[];
  timeline: TimelinePoint[];
  topLocations: TopLocation[];
  source: 'gdelt' | 'newsdata' | 'guardian' | 'cache' | 'demo';
}

/* ================================================================== */
/*  Layer 1 — localStorage persistent cache                           */
/* ================================================================== */

const STORAGE_PREFIX = 'fluxmap_cache_';
const STORAGE_TTL = 30 * 60 * 1000; // 30 min — stale but usable

function storageKey(channelId: string, timeWindow: TimeWindow): string {
  return `${STORAGE_PREFIX}${channelId}_${timeWindow}`;
}

export function saveToStorage(channelId: string, tw: TimeWindow, data: DataResult): void {
  try {
    const payload = { ts: Date.now(), data };
    localStorage.setItem(storageKey(channelId, tw), JSON.stringify(payload));
  } catch {
    // localStorage full — silently ignore
  }
}

export function loadFromStorage(channelId: string, tw: TimeWindow): DataResult | null {
  try {
    const raw = localStorage.getItem(storageKey(channelId, tw));
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw) as { ts: number; data: DataResult };
    if (Date.now() - ts > STORAGE_TTL) {
      localStorage.removeItem(storageKey(channelId, tw));
      return null;
    }
    return { ...data, source: 'cache' };
  } catch {
    return null;
  }
}

/* ================================================================== */
/*  Layer 2 — GDELT (primary source)                                  */
/* ================================================================== */

async function tryGdelt(
  channelQuery: string,
  timeWindow: TimeWindow,
  search?: string,
): Promise<DataResult | null> {
  try {
    const [geo, articles, timeline] = await Promise.all([
      gdeltFetchGeo(channelQuery, timeWindow, search),
      gdeltFetchArticles(channelQuery, timeWindow, search),
      gdeltFetchTimeline(channelQuery, timeWindow, search),
    ]);

    // If ALL three are empty, GDELT is probably down
    if (geo.length === 0 && articles.length === 0 && timeline.length === 0) {
      return null;
    }

    return {
      geo,
      articles,
      timeline,
      topLocations: deriveTopLocations(geo, 10),
      source: 'gdelt',
    };
  } catch (err) {
    console.warn('[provider] GDELT failed:', err);
    return null;
  }
}

/* ================================================================== */
/*  Layer 1 — NewsData.io (primary live source)                       */
/* ================================================================== */

/** Map channel IDs to NewsData.io / Guardian keywords */
const CHANNEL_KEYWORDS: Record<string, string> = {
  all: '',
  protest: 'protest OR demonstration OR riot',
  wildfire: 'wildfire OR forest fire',
  earthquake: 'earthquake OR seismic',
  flood: 'flood OR flooding',
  cyber: 'cyberattack OR ransomware OR data breach',
  health: 'outbreak OR pandemic OR epidemic',
  economy: 'inflation OR recession OR economic crisis',
  elections: 'election OR voting OR ballot',
};

/** Built-in city → coordinates dictionary for geocoding (no external API needed) */
const CITY_COORDS: Record<string, [number, number]> = {
  // [lat, lng] format
  'united states': [38.90, -77.04],
  'us': [38.90, -77.04],
  'usa': [38.90, -77.04],
  'united kingdom': [51.51, -0.12],
  'uk': [51.51, -0.12],
  'france': [48.86, 2.35],
  'germany': [52.52, 13.41],
  'japan': [35.69, 139.69],
  'china': [39.90, 116.40],
  'india': [28.61, 77.21],
  'brazil': [-22.91, -43.17],
  'russia': [55.75, 37.62],
  'australia': [-33.87, 151.21],
  'canada': [45.42, -75.69],
  'south korea': [37.57, 126.98],
  'korea': [37.57, 126.98],
  'mexico': [19.43, -99.13],
  'turkey': [41.01, 28.98],
  'egypt': [30.04, 31.24],
  'italy': [41.88, 12.49],
  'spain': [40.42, -3.70],
  'indonesia': [-6.21, 106.85],
  'thailand': [13.75, 100.50],
  'south africa': [-33.92, 18.42],
  'argentina': [-34.60, -58.38],
  'ukraine': [50.45, 30.52],
  'poland': [52.23, 21.01],
  'netherlands': [52.37, 4.90],
  'pakistan': [33.69, 73.04],
  'saudi arabia': [24.71, 46.67],
  'nigeria': [9.08, 7.49],
  'iran': [35.69, 51.39],
  'israel': [31.77, 35.23],
  'bangladesh': [23.81, 90.41],
  'vietnam': [21.03, 105.85],
  'philippines': [14.60, 120.98],
  'colombia': [4.71, -74.07],
  'chile': [-33.45, -70.65],
  'peru': [-12.05, -77.04],
  'iraq': [33.31, 44.37],
  'syria': [33.51, 36.28],
  'afghanistan': [34.53, 69.17],
  'qatar': [25.29, 51.53],
  'uae': [25.20, 55.27],
  'singapore': [1.35, 103.82],
  'malaysia': [3.14, 101.69],
  'taiwan': [25.03, 121.57],
  'switzerland': [46.95, 7.45],
  'sweden': [59.33, 18.07],
  'norway': [59.91, 10.75],
  'denmark': [55.68, 12.57],
  'finland': [60.17, 24.94],
  'greece': [37.98, 23.73],
  'portugal': [38.72, -9.14],
  'new zealand': [-41.29, 174.78],
  'kenya': [-1.29, 36.82],
  'ethiopia': [9.02, 38.75],
  'ghana': [5.56, -0.19],
  'morocco': [33.97, -6.85],
  'algeria': [36.75, 3.06],
  'tunisia': [36.81, 10.18],
  'lebanon': [33.89, 35.50],
  'jordan': [31.95, 35.93],
  'myanmar': [16.87, 96.20],
  'cambodia': [11.56, 104.93],
  // Major cities that appear in news
  'washington': [38.90, -77.04],
  'new york': [40.71, -74.01],
  'london': [51.51, -0.12],
  'paris': [48.86, 2.35],
  'tokyo': [35.69, 139.69],
  'beijing': [39.90, 116.40],
  'moscow': [55.75, 37.62],
  'berlin': [52.52, 13.41],
  'rome': [41.88, 12.49],
  'madrid': [40.42, -3.70],
  'sydney': [-33.87, 151.21],
  'toronto': [43.65, -79.38],
  'los angeles': [34.05, -118.24],
  'chicago': [41.88, -87.63],
  'mumbai': [19.08, 72.88],
  'delhi': [28.61, 77.21],
  'shanghai': [31.23, 121.47],
  'hong kong': [22.28, 114.17],
  'dubai': [25.20, 55.27],
  'istanbul': [41.01, 28.98],
  'cairo': [30.04, 31.24],
  'seoul': [37.57, 126.98],
  'bangkok': [13.75, 100.50],
  'jakarta': [-6.21, 106.85],
  'buenos aires': [-34.60, -58.38],
  'são paulo': [-23.55, -46.63],
  'sao paulo': [-23.55, -46.63],
  'rio de janeiro': [-22.91, -43.17],
  'mexico city': [19.43, -99.13],
  'cape town': [-33.92, 18.42],
  'nairobi': [-1.29, 36.82],
  'baghdad': [33.31, 44.37],
  'kabul': [34.53, 69.17],
  'kyiv': [50.45, 30.52],
  'kiev': [50.45, 30.52],
  'tel aviv': [32.09, 34.78],
  'jerusalem': [31.77, 35.23],
  'gaza': [31.50, 34.47],
  'beirut': [33.89, 35.50],
  'tehran': [35.69, 51.39],
  'islamabad': [33.69, 73.04],
  'dhaka': [23.81, 90.41],
  'hanoi': [21.03, 105.85],
  'manila': [14.60, 120.98],
  'singapore city': [1.35, 103.82],
  'kuala lumpur': [3.14, 101.69],
  'taipei': [25.03, 121.57],
  'ottawa': [45.42, -75.69],
  'canberra': [-35.28, 149.13],
  'wellington': [-41.29, 174.78],
  'stockholm': [59.33, 18.07],
  'oslo': [59.91, 10.75],
  'copenhagen': [55.68, 12.57],
  'helsinki': [60.17, 24.94],
  'athens': [37.98, 23.73],
  'lisbon': [38.72, -9.14],
  'amsterdam': [52.37, 4.90],
  'brussels': [50.85, 4.35],
  'vienna': [48.21, 16.37],
  'zurich': [47.38, 8.54],
  'geneva': [46.20, 6.14],
  'warsaw': [52.23, 21.01],
  'prague': [50.08, 14.44],
  'budapest': [47.50, 19.04],
  'bucharest': [44.43, 26.10],
  'lagos': [6.52, 3.38],
  'johannesburg': [-26.20, 28.04],
  'addis ababa': [9.02, 38.75],
  'lima': [-12.05, -77.04],
  'bogota': [4.71, -74.07],
  'santiago': [-33.45, -70.65],
  'houston': [29.76, -95.36],
  'san francisco': [37.77, -122.42],
  'seattle': [47.61, -122.33],
  'boston': [42.36, -71.06],
  'miami': [25.76, -80.19],
  'atlanta': [33.75, -84.39],
  'denver': [39.74, -104.99],
  'phoenix': [33.45, -112.07],
  'dallas': [32.78, -96.80],
  'detroit': [42.33, -83.05],
  'minneapolis': [44.98, -93.27],
  'portland': [45.52, -122.68],
  'sacramento': [38.58, -121.49],
};

/**
 * Extract location name from NewsData.io article and resolve to coordinates.
 * Uses the article's country field and scans the title for city names.
 */
function extractGeoFromArticle(
  article: { title?: string; country?: string[]; source_url?: string },
): { name: string; lat: number; lng: number } | null {
  // Try country list first
  if (article.country && article.country.length > 0) {
    for (const c of article.country) {
      const key = c.toLowerCase().trim();
      const coords = CITY_COORDS[key];
      if (coords) return { name: c, lat: coords[0], lng: coords[1] };
    }
  }

  // Scan title for known city/country names
  if (article.title) {
    const titleLower = article.title.toLowerCase();
    for (const [name, coords] of Object.entries(CITY_COORDS)) {
      if (titleLower.includes(name)) {
        return {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          lat: coords[0],
          lng: coords[1],
        };
      }
    }
  }

  return null;
}

/** NewsData.io article response shape */
interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string;
  description?: string;
  pubDate: string;
  source_name?: string;
  source_url?: string;
  image_url?: string;
  country?: string[];
  category?: string[];
  language?: string;
}

interface NewsDataResponse {
  status: string;
  totalResults?: number;
  results?: NewsDataArticle[];
  nextPage?: string;
}

async function tryNewsData(
  channelId: string,
  _timeWindow: TimeWindow,
  search?: string,
): Promise<DataResult | null> {
  try {
    const keywords = search?.trim()
      ? search.trim()
      : CHANNEL_KEYWORDS[channelId] || '';

    const params = new URLSearchParams();
    if (keywords) params.set('q', keywords);
    params.set('language', 'en');
    params.set('size', '10');

    // Call through serverless proxy (key stays server-side)
    const url = `/api/newsdata?${params.toString()}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn('[provider] NewsData.io returned', res.status);
      return null;
    }

    const json = (await res.json()) as NewsDataResponse;
    if (!json.results || json.results.length === 0) return null;

    // Convert to our unified format
    const articles: GdeltArticle[] = json.results.map((a) => ({
      url: a.link || '',
      url_mobile: '',
      title: a.title || '(no title)',
      seendate: a.pubDate ? a.pubDate.replace(/[-: ]/g, '').slice(0, 15) + 'Z' : '',
      socialimage: a.image_url || '',
      domain: a.source_url?.replace(/^https?:\/\//, '').replace(/\/$/, '') || a.source_name || '',
      language: a.language || 'en',
      sourcecountry: a.country?.[0] || '',
    }));

    // Extract geo features from articles
    const geoMap = new Map<string, GeoFeature>();
    for (const rawArticle of json.results) {
      const loc = extractGeoFromArticle(rawArticle);
      if (!loc) continue;

      const existing = geoMap.get(loc.name);
      if (existing) {
        existing.properties.count += 1;
      } else {
        geoMap.set(loc.name, {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [loc.lng, loc.lat] },
          properties: { name: loc.name, count: 1, shareimage: '', html: '' },
        });
      }
    }

    const geo = Array.from(geoMap.values());
    const topLocations = deriveTopLocations(geo, 10);

    // Build simple timeline from article publish dates
    const timeline: TimelinePoint[] = buildTimelineFromArticles(articles);

    return {
      geo,
      articles,
      timeline,
      topLocations,
      source: 'newsdata',
    };
  } catch (err) {
    console.warn('[provider] NewsData failed:', err);
    return null;
  }
}

/** Build a simple timeline from article timestamps */
function buildTimelineFromArticles(articles: GdeltArticle[]): TimelinePoint[] {
  const buckets = new Map<string, number>();

  for (const a of articles) {
    // seendate format: "20260303T060000Z" or converted pubDate
    const dateStr = a.seendate;
    if (dateStr.length >= 11) {
      // Group by hour
      const hourKey = dateStr.slice(0, 11); // "20260303T06"
      buckets.set(hourKey, (buckets.get(hourKey) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => {
      // Convert "20260303T06" to readable date
      const y = key.slice(0, 4);
      const m = key.slice(4, 6);
      const d = key.slice(6, 8);
      const h = key.slice(9, 11);
      const dateObj = new Date(`${y}-${m}-${d}T${h}:00:00Z`);
      return {
        date: dateObj.toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric',
          hour: 'numeric',
        }),
        value: count,
      };
    });
}

/* ================================================================== */
/*  Layer 2 — The Guardian Open Platform                               */
/* ================================================================== */

interface GuardianResult {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  sectionName?: string;
  fields?: { trailText?: string; thumbnail?: string };
}

interface GuardianResponse {
  response?: {
    status: string;
    results?: GuardianResult[];
  };
}

async function tryGuardian(
  channelId: string,
  _timeWindow: TimeWindow,
  search?: string,
): Promise<DataResult | null> {
  try {
    const keywords = search?.trim()
      ? search.trim()
      : CHANNEL_KEYWORDS[channelId] || 'world';

    const params = new URLSearchParams();
    params.set('q', keywords);
    params.set('page-size', '20');

    // Call through serverless proxy (key stays server-side)
    const url = `/api/guardian?${params.toString()}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn('[provider] Guardian API returned', res.status);
      return null;
    }

    const json = (await res.json()) as GuardianResponse;
    const results = json.response?.results;
    if (!results || results.length === 0) return null;

    // Convert to unified article format
    const articles: GdeltArticle[] = results.map((r) => ({
      url: r.webUrl || '',
      url_mobile: '',
      title: r.webTitle || '(no title)',
      seendate: r.webPublicationDate
        ? r.webPublicationDate.replace(/[-:T]/g, '').slice(0, 15) + 'Z'
        : '',
      socialimage: r.fields?.thumbnail || '',
      domain: 'theguardian.com',
      language: 'en',
      sourcecountry: 'uk',
    }));

    // Extract geo from article titles
    const geoMap = new Map<string, GeoFeature>();
    for (const r of results) {
      const loc = extractGeoFromArticle({ title: r.webTitle, country: [], source_url: r.webUrl });
      if (!loc) continue;
      const existing = geoMap.get(loc.name);
      if (existing) {
        existing.properties.count += 1;
      } else {
        geoMap.set(loc.name, {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [loc.lng, loc.lat] },
          properties: { name: loc.name, count: 1, shareimage: '', html: '' },
        });
      }
    }

    const geo = Array.from(geoMap.values());
    const topLocations = deriveTopLocations(geo, 10);
    const timeline = buildTimelineFromArticles(articles);

    return { geo, articles, timeline, topLocations, source: 'guardian' };
  } catch (err) {
    console.warn('[provider] Guardian failed:', err);
    return null;
  }
}

/* ================================================================== */
/*  Layer 3 — GDELT                                                    */
/* ================================================================== */

/* (tryGdelt function defined above, moved logically here) */

/* ================================================================== */
/*  Layer 4 — Demo data                                               */
/* ================================================================== */

function getDemoResult(channelId: string): DataResult {
  return {
    geo: getDemoGeo(channelId),
    articles: getDemoArticles(channelId),
    timeline: getDemoTimeline(channelId),
    topLocations: getDemoTopLocations(channelId, 10),
    source: 'demo',
  };
}

/* ================================================================== */
/*  Main provider chain entry point                                    */
/* ================================================================== */

/**
 * Fetch data from the multi-source provider chain.
 * Order: NewsData.io → Guardian → GDELT → localStorage cache → demo
 */
export async function fetchAllData(
  channelId: string,
  channelQuery: string,
  timeWindow: TimeWindow,
  search?: string,
): Promise<DataResult> {
  // 1. Try NewsData.io (primary live source)
  console.log('[provider] Trying NewsData.io...');
  const newsResult = await tryNewsData(channelId, timeWindow, search);
  if (newsResult) {
    console.log('[provider] ✅ NewsData.io succeeded');
    saveToStorage(channelId, timeWindow, newsResult);
    return newsResult;
  }

  // 2. Try The Guardian (second live source, free with 'test' key)
  console.log('[provider] NewsData.io failed/skipped, trying Guardian...');
  const guardianResult = await tryGuardian(channelId, timeWindow, search);
  if (guardianResult) {
    console.log('[provider] ✅ Guardian succeeded');
    saveToStorage(channelId, timeWindow, guardianResult);
    return guardianResult;
  }

  // 3. Try GDELT (geo-native but currently unreachable)
  console.log('[provider] Guardian failed, trying GDELT...');
  const gdeltResult = await tryGdelt(channelQuery, timeWindow, search);
  if (gdeltResult) {
    console.log('[provider] ✅ GDELT succeeded');
    saveToStorage(channelId, timeWindow, gdeltResult);
    return gdeltResult;
  }

  // 4. Try localStorage cache (stale but visible)
  console.log('[provider] All live sources failed, trying cache...');
  const cached = loadFromStorage(channelId, timeWindow);
  if (cached) {
    console.log('[provider] ✅ Using cached data');
    return cached;
  }

  // 5. Fall back to demo data (always available)
  console.log('[provider] All sources failed, using demo data');
  return getDemoResult(channelId);
}
