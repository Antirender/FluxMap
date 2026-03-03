/**
 * Demo / fallback data for when the GDELT API is unreachable.
 *
 * Provides realistic sample responses so the app UI remains functional
 * during GDELT outages. Each channel gets its own data set.
 */

import type { GeoFeature, GdeltArticle, TimelinePoint, TopLocation } from '../types';

/* ------------------------------------------------------------------ */
/*  GEO features – sample points around the world                     */
/* ------------------------------------------------------------------ */

function pt(lng: number, lat: number, name: string, count: number): GeoFeature {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
    properties: { name, count, shareimage: '', html: '' },
  };
}

const DEMO_GEO: Record<string, GeoFeature[]> = {
  all: [
    pt(-77.04, 38.90, 'Washington, D.C., United States', 245),
    pt(-0.12,  51.51,  'London, United Kingdom', 198),
    pt(2.35,   48.86,  'Paris, France', 165),
    pt(139.69, 35.69,  'Tokyo, Japan', 143),
    pt(116.40, 39.90,  'Beijing, China', 132),
    pt(-73.94, 40.67,  'New York, United States', 210),
    pt(37.62,  55.75,  'Moscow, Russia', 95),
    pt(28.98,  41.01,  'Istanbul, Turkey', 88),
    pt(77.21,  28.61,  'New Delhi, India', 120),
    pt(151.21, -33.87, 'Sydney, Australia', 78),
    pt(-43.17, -22.91, 'Rio de Janeiro, Brazil', 66),
    pt(31.24,  30.04,  'Cairo, Egypt', 72),
    pt(-3.70,  40.42,  'Madrid, Spain', 58),
    pt(13.41,  52.52,  'Berlin, Germany', 91),
    pt(126.98, 37.57,  'Seoul, South Korea', 104),
    pt(-118.24, 34.05, 'Los Angeles, United States', 155),
    pt(100.50, 13.75,  'Bangkok, Thailand', 52),
    pt(-99.13, 19.43,  'Mexico City, Mexico', 68),
    pt(44.42,  33.31,  'Baghdad, Iraq', 47),
    pt(36.28,  33.51,  'Damascus, Syria', 42),
  ],
  protest: [
    pt(2.35,   48.86,  'Paris, France',  85),
    pt(28.98,  41.01,  'Istanbul, Turkey', 72),
    pt(-43.17, -22.91, 'Rio de Janeiro, Brazil', 58),
    pt(-3.70,  40.42,  'Madrid, Spain', 45),
    pt(77.21,  28.61,  'New Delhi, India', 63),
    pt(31.24,  30.04,  'Cairo, Egypt', 54),
    pt(-73.94, 40.67,  'New York, United States', 48),
    pt(139.69, 35.69,  'Tokyo, Japan', 33),
    pt(13.41,  52.52,  'Berlin, Germany', 41),
    pt(-77.04, 38.90,  'Washington, D.C., United States', 56),
    pt(-118.24, 34.05, 'Los Angeles, United States', 38),
    pt(100.50, 13.75,  'Bangkok, Thailand', 62),
    pt(18.42,  -33.92, 'Cape Town, South Africa', 29),
  ],
  wildfire: [
    pt(-118.24, 34.05, 'Los Angeles, United States', 92),
    pt(-122.42, 37.77, 'San Francisco, United States', 45),
    pt(151.21, -33.87, 'Sydney, Australia', 78),
    pt(23.73,  37.98,  'Athens, Greece', 55),
    pt(-8.61,  41.15,  'Porto, Portugal', 42),
    pt(116.40, 39.90,  'Beijing, China', 28),
    pt(44.83,  -12.78, 'Brasilia, Brazil', 38),
    pt(28.98,  41.01,  'Istanbul, Turkey', 48),
    pt(-79.38, 43.65,  'Toronto, Canada', 22),
    pt(149.13, -35.28, 'Canberra, Australia', 65),
  ],
  earthquake: [
    pt(139.69, 35.69,  'Tokyo, Japan', 110),
    pt(29.02,  40.73,  'Istanbul, Turkey', 74),
    pt(69.17,  34.53,  'Kabul, Afghanistan', 62),
    pt(-99.13, 19.43,  'Mexico City, Mexico', 55),
    pt(-75.68, -13.53, 'Lima, Peru', 48),
    pt(121.47, 31.23,  'Shanghai, China', 38),
    pt(72.88,  19.08,  'Mumbai, India', 44),
    pt( 12.49, 41.88,  'Rome, Italy', 28),
    pt(-70.65, -33.45, 'Santiago, Chile', 52),
    pt(174.78, -41.29, 'Wellington, New Zealand', 35),
  ],
  flood: [
    pt(90.41,  23.81,  'Dhaka, Bangladesh', 95),
    pt(77.21,  28.61,  'New Delhi, India', 82),
    pt(100.50, 13.75,  'Bangkok, Thailand', 70),
    pt(106.85, -6.21,  'Jakarta, Indonesia', 65),
    pt(121.47, 31.23,  'Shanghai, China', 45),
    pt(-43.17, -22.91, 'Rio de Janeiro, Brazil', 38),
    pt(32.58,  0.35,   'Kampala, Uganda', 33),
    pt(-95.36, 29.76,  'Houston, United States', 52),
    pt(114.17, 22.28,  'Hong Kong, China', 28),
    pt(-1.90,  52.48,  'Birmingham, United Kingdom', 22),
  ],
};

/* ------------------------------------------------------------------ */
/*  Articles – sample article data                                    */
/* ------------------------------------------------------------------ */

function art(title: string, domain: string, country: string, minAgo: number): GdeltArticle {
  const d = new Date(Date.now() - minAgo * 60_000);
  const seendate = d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return {
    url: `https://${domain}/article/${Math.random().toString(36).slice(2, 8)}`,
    url_mobile: '',
    title,
    seendate,
    socialimage: '',
    domain,
    language: 'English',
    sourcecountry: country,
  };
}

const DEMO_ARTICLES: Record<string, GdeltArticle[]> = {
  all: [
    art('Global leaders gather for summit on climate action', 'reuters.com', 'United States', 5),
    art('Stock markets rally on positive economic data', 'bbc.com', 'United Kingdom', 12),
    art('New AI regulations proposed by European Union', 'theguardian.com', 'United Kingdom', 18),
    art('Space agency announces new Mars mission timeline', 'nytimes.com', 'United States', 25),
    art('Healthcare reform debate continues in Washington', 'washingtonpost.com', 'United States', 30),
    art('Tech companies report strong quarterly earnings', 'cnbc.com', 'United States', 35),
    art('Olympic committee confirms host city for 2036 games', 'espn.com', 'United States', 40),
    art('Renewable energy investments reach record high', 'ft.com', 'United Kingdom', 45),
    art('Trade negotiations resume between major economies', 'aljazeera.com', 'Qatar', 50),
    art('Scientists discover high-temperature superconductor', 'nature.com', 'United Kingdom', 55),
  ],
  protest: [
    art('Thousands rally in Paris over pension reform', 'reuters.com', 'France', 8),
    art('Anti-government protests escalate in multiple cities', 'bbc.com', 'United Kingdom', 15),
    art('Student demonstrations spread across campuses', 'theguardian.com', 'United Kingdom', 22),
    art('Workers strike disrupts public transportation', 'aljazeera.com', 'Qatar', 28),
    art('Police deploy tear gas at unauthorized rally', 'apnews.com', 'United States', 35),
    art('Protesters block major highway in São Paulo', 'reuters.com', 'Brazil', 42),
    art('Union leaders call for nationwide workers march', 'bbc.com', 'United Kingdom', 48),
  ],
  wildfire: [
    art('Wildfire spreads across Southern California hillsides', 'latimes.com', 'United States', 6),
    art('Firefighters battle blazes in Australian bushland', 'abc.net.au', 'Australia', 14),
    art('Greece evacuates coastal towns as fires advance', 'reuters.com', 'Greece', 20),
    art('Record heat fuels wildfire season across Western US', 'washingtonpost.com', 'United States', 30),
    art('Portugal declares state of emergency over forest fires', 'bbc.com', 'Portugal', 38),
    art('Air quality warnings issued as smoke blankets city', 'cnn.com', 'United States', 45),
  ],
  earthquake: [
    art('Magnitude 6.2 earthquake strikes off coast of Japan', 'reuters.com', 'Japan', 4),
    art('Aftershocks continue following major tremor in Turkey', 'bbc.com', 'Turkey', 12),
    art('Earthquake early warning system saves lives in Mexico', 'apnews.com', 'Mexico', 20),
    art('Experts warn of increased seismic activity in Pacific Ring', 'nature.com', 'United Kingdom', 28),
    art('Emergency teams deployed after earthquake in Afghanistan', 'aljazeera.com', 'Qatar', 36),
    art('Chile upgrades earthquake preparedness protocols', 'reuters.com', 'Chile', 44),
  ],
  flood: [
    art('Monsoon flooding displaces thousands in Bangladesh', 'reuters.com', 'Bangladesh', 7),
    art('Flash floods hit northern India amid heavy rainfall', 'bbc.com', 'India', 14),
    art('Jakarta residents evacuated as floods inundate city', 'aljazeera.com', 'Indonesia', 22),
    art('Dam overflow threatens communities downstream', 'washingtonpost.com', 'United States', 30),
    art('Climate change linked to increased flood severity', 'theguardian.com', 'United Kingdom', 38),
    art('Rescue operations continue after catastrophic flooding', 'cnn.com', 'United States', 45),
  ],
};

/* ------------------------------------------------------------------ */
/*  Timeline – simulated hourly volume data                           */
/* ------------------------------------------------------------------ */

function generateTimeline(points: number, baseValue: number): TimelinePoint[] {
  const now = Date.now();
  const interval = (60 * 60 * 1000) / points; // distribute points over 1h by default
  const result: TimelinePoint[] = [];
  for (let i = 0; i < points; i++) {
    const d = new Date(now - (points - i) * interval);
    const noise = Math.floor(Math.random() * baseValue * 0.4 - baseValue * 0.2);
    const trend = Math.sin((i / points) * Math.PI) * baseValue * 0.3;
    result.push({
      date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      value: Math.max(1, Math.round(baseValue + noise + trend)),
    });
  }
  return result;
}

const DEMO_TIMELINE: Record<string, TimelinePoint[]> = {
  all:        generateTimeline(24, 180),
  protest:    generateTimeline(24, 65),
  wildfire:   generateTimeline(24, 40),
  earthquake: generateTimeline(24, 50),
  flood:      generateTimeline(24, 45),
};

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

/** Check whether demo data should be used (all fetches failed) */
export function getDemoGeo(channelId: string): GeoFeature[] {
  return DEMO_GEO[channelId] ?? DEMO_GEO.all;
}

export function getDemoArticles(channelId: string): GdeltArticle[] {
  return DEMO_ARTICLES[channelId] ?? DEMO_ARTICLES.all;
}

export function getDemoTimeline(channelId: string): TimelinePoint[] {
  return DEMO_TIMELINE[channelId] ?? DEMO_TIMELINE.all;
}

export function getDemoTopLocations(channelId: string, limit = 10): TopLocation[] {
  const features = getDemoGeo(channelId);
  const map = new Map<string, { count: number; lat: number; lng: number }>();
  for (const f of features) {
    const name = f.properties.name;
    const [lng, lat] = f.geometry.coordinates;
    const existing = map.get(name);
    if (existing) {
      existing.count += f.properties.count;
    } else {
      map.set(name, { count: f.properties.count, lat, lng });
    }
  }
  return Array.from(map.entries())
    .map(([name, d]) => ({ name, count: d.count, lat: d.lat, lng: d.lng }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
