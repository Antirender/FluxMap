/**
 * GDELT API integration layer
 *
 * In production (Vercel) all requests go through /api/gdelt-geo and
 * /api/gdelt-doc serverless proxies that add CDN Cache-Control headers.
 * In local dev, Vite proxy forwards the same paths to GDELT directly.
 *
 * Client-side cache uses per-key TTL + LRU eviction — switching channels
 * no longer clears everything, so revisiting a channel is instant.
 */

import type { TimeWindow, GeoFeature, GdeltArticle, TimelinePoint, TopLocation } from '../types';

/* ------------------------------------------------------------------ */
/*  Base URLs – always go through our proxy layer                     */
/* ------------------------------------------------------------------ */
const GEO_BASE = '/api/gdelt-geo';
const DOC_BASE = '/api/gdelt-doc';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Convert UI time-window to GDELT timespan string */
export function timespanFromWindow(window: TimeWindow): string {
  const map: Record<TimeWindow, string> = {
    '15m': '15min',
    '1h':  '60min',
    '6h':  '360min',
    '24h': '1440min',
    '7d':  '7days',
  };
  return map[window];
}

/** Build the full query – combines channel query + optional search term */
export function buildQuery(channelQuery: string, search?: string): string {
  const parts: string[] = [];
  if (channelQuery) parts.push(channelQuery);
  if (search?.trim()) parts.push(`"${search.trim()}"`);
  return parts.length > 0 ? parts.join(' ') : 'sourcelang:english';
}

/* ------------------------------------------------------------------ */
/*  LRU + TTL In-memory cache                                        */
/* ------------------------------------------------------------------ */
const CACHE_TTL = 60 * 1000;   // 60 s — matches Vercel CDN s-maxage
const CACHE_MAX = 80;          // max entries before LRU eviction

interface CacheEntry { ts: number; data: unknown }
const cache = new Map<string, CacheEntry>();

function cached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  // Move to end (most-recently-used)
  cache.delete(key);
  cache.set(key, entry);
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  // Evict oldest if at capacity
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { ts: Date.now(), data });
}

/** Evict only entries whose key contains the given substring (optional targeted clear) */
export function evictByPrefix(prefix: string) {
  for (const key of [...cache.keys()]) {
    if (key.includes(prefix)) cache.delete(key);
  }
}

/** Full clear (only used in tests / edge cases) */
export function clearCache() {
  cache.clear();
}

/* ------------------------------------------------------------------ */
/*  GEO 2.0 – geographic point data (GeoJSON)                        */
/* ------------------------------------------------------------------ */

export interface GeoApiResponse {
  type: string;
  features: GeoFeature[];
}

/**
 * Fetch geo-located news points from GDELT GEO 2.0 API.
 * Returns parsed GeoJSON features.
 */
export async function fetchGeoData(
  channelQuery: string,
  timeWindow: TimeWindow,
  search?: string,
): Promise<GeoFeature[]> {
  const query = buildQuery(channelQuery, search);
  const ts = timespanFromWindow(timeWindow);
  const cacheKey = `geo:${query}:${ts}`;

  const hit = cached<GeoFeature[]>(cacheKey);
  if (hit) return hit;

  const url = `${GEO_BASE}?query=${encodeURIComponent(query)}&mode=PointData&format=GeoJSON&timespan=${ts}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GEO API ${res.status}`);
    const text = await res.text();
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      console.warn('[FluxMap] GEO API non-JSON:', text.slice(0, 120));
      return [];
    }
    const json = JSON.parse(text) as GeoApiResponse;
    const features: GeoFeature[] = (json.features ?? [])
      .map((f, i) => {
        const p = f.properties ?? ({} as Record<string, unknown>);
        return {
          type: 'Feature' as const,
          geometry: f.geometry,
          properties: {
            name: (p.name as string) ?? `Point ${i}`,
            count: Number(p.count ?? p.nbarts ?? 1),
            shareimage: (p.shareimage as string) ?? '',
            html: (p.html as string) ?? '',
          },
        };
      })
      // Filter out GDELT error messages returned as feature names
      .filter((f) => !f.properties.name.startsWith('ERROR'));
    console.debug(`[FluxMap] GEO → ${features.length} features`);
    setCache(cacheKey, features);
    return features;
  } catch (err) {
    console.error('[FluxMap] GEO API error:', err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  DOC 2.0 – article list                                            */
/* ------------------------------------------------------------------ */

export interface DocArtListResponse {
  articles?: GdeltArticle[];
}

/**
 * Fetch recent articles from GDELT DOC 2.0 API.
 */
export async function fetchArticles(
  channelQuery: string,
  timeWindow: TimeWindow,
  search?: string,
  maxRecords = 25,
): Promise<GdeltArticle[]> {
  const query = buildQuery(channelQuery, search);
  const ts = timespanFromWindow(timeWindow);
  const cacheKey = `doc:${query}:${ts}:${maxRecords}`;

  const hit = cached<GdeltArticle[]>(cacheKey);
  if (hit) return hit;

  const url =
    `${DOC_BASE}?query=${encodeURIComponent(query)}` +
    `&mode=ArtList&format=json&timespan=${ts}` +
    `&maxrecords=${maxRecords}&sort=DateDesc`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`DOC API ${res.status}`);
    const text = await res.text();
    if (!text.trim().startsWith('{')) {
      console.warn('[FluxMap] DOC ArtList non-JSON (rate-limited?):', text.slice(0, 120));
      return [];
    }
    const json = JSON.parse(text) as DocArtListResponse;
    // Detect GDELT error responses embedded in article data
    if (!json.articles && typeof json === 'object') {
      const raw = JSON.stringify(json);
      if (raw.includes('ERROR') || raw.includes('error')) {
        console.warn('[FluxMap] DOC ArtList returned error payload:', raw.slice(0, 200));
        return [];
      }
    }
    const articles: GdeltArticle[] = (json.articles ?? []).map((a) => ({
      url: a.url ?? '',
      url_mobile: a.url_mobile ?? '',
      title: a.title ?? '(no title)',
      seendate: a.seendate ?? '',
      socialimage: a.socialimage ?? '',
      domain: a.domain ?? '',
      language: a.language ?? '',
      sourcecountry: a.sourcecountry ?? '',
    }));
    console.debug(`[FluxMap] DOC ArtList → ${articles.length} articles`);
    setCache(cacheKey, articles);
    return articles;
  } catch (err) {
    console.error('[FluxMap] DOC ArtList API error:', err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  DOC 2.0 – timeline volume (for trend chart)                       */
/* ------------------------------------------------------------------ */

export interface TimelineVolResponse {
  timeline?: Array<{
    series?: string;
    data?: Array<{ date: string; value: string | number }>;
  }>;
}

/**
 * Fetch article-volume timeline from GDELT DOC 2.0 API.
 */
export async function fetchTimeline(
  channelQuery: string,
  timeWindow: TimeWindow,
  search?: string,
): Promise<TimelinePoint[]> {
  const query = buildQuery(channelQuery, search);
  const ts = timespanFromWindow(timeWindow);
  const cacheKey = `timeline:${query}:${ts}`;

  const hit = cached<TimelinePoint[]>(cacheKey);
  if (hit) return hit;

  const url =
    `${DOC_BASE}?query=${encodeURIComponent(query)}` +
    `&mode=TimelineVol&format=json&timespan=${ts}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`DOC Timeline API ${res.status}`);
    const text = await res.text();
    if (!text.trim().startsWith('{')) {
      console.warn('[FluxMap] DOC Timeline non-JSON (rate-limited?):', text.slice(0, 120));
      return [];
    }
    const json = JSON.parse(text) as TimelineVolResponse;

    // GDELT returns { timeline: [{ series: "Volume Intensity", data: [...] }] }
    const dataArr = json.timeline?.[0]?.data ?? [];
    const points: TimelinePoint[] = dataArr.map((s) => ({
      date: s.date,
      value: Number(s.value),
    }));
    console.debug(`[FluxMap] DOC Timeline → ${points.length} points`);
    setCache(cacheKey, points);
    return points;
  } catch (err) {
    console.error('[FluxMap] DOC Timeline API error:', err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Derived: top locations from geo data                               */
/* ------------------------------------------------------------------ */

/**
 * Aggregate GEO features → top locations sorted by article count.
 */
export function deriveTopLocations(features: GeoFeature[], limit = 10): TopLocation[] {
  // Group by name and sum counts
  const map = new Map<string, { count: number; lat: number; lng: number }>();
  for (const f of features) {
    const name = f.properties.name ?? 'Unknown';
    const existing = map.get(name);
    const count = f.properties.count ?? 1;
    const [lng, lat] = f.geometry?.coordinates ?? [0, 0];
    if (existing) {
      existing.count += count;
    } else {
      map.set(name, { count, lat, lng });
    }
  }

  return Array.from(map.entries())
    .map(([name, d]) => ({ name, count: d.count, lat: d.lat, lng: d.lng }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
