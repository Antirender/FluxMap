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
/*  Articles – REAL articles with verified working links              */
/* ------------------------------------------------------------------ */

function realArt(title: string, domain: string, country: string, url: string, isoDate: string): GdeltArticle {
  const seendate = isoDate.replace(/[-:T]/g, '').slice(0, 15) + 'Z';
  return {
    url,
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
    realArt('NASA Analysis Confirms 2023 as Warmest Year on Record', 'nasa.gov', 'United States',
      'https://www.nasa.gov/news-release/nasa-analysis-confirms-2023-as-warmest-year-on-record/', '2024-01-11T00:00:00'),
    realArt('2023 was the world\'s warmest year on record, by far', 'noaa.gov', 'United States',
      'https://www.noaa.gov/news/2023-was-worlds-warmest-year-on-record-by-far', '2024-01-12T00:00:00'),
    realArt('World had warmest January on record', 'wmo.int', 'Switzerland',
      'https://wmo.int/media/news/world-had-warmest-january-record', '2024-02-15T00:00:00'),
    realArt('Security Council demands immediate ceasefire in Gaza', 'un.org', 'United States',
      'https://press.un.org/en/2024/sc15641.doc.htm', '2024-03-25T00:00:00'),
    realArt('A/RES/78/265 — Seizing the opportunities of safe, secure and trustworthy AI systems', 'un.org', 'United States',
      'https://docs.un.org/en/A/res/78/265', '2024-04-01T00:00:00'),
    realArt('WHO Director-General: end of COVID-19 as a global health emergency', 'who.int', 'Switzerland',
      'https://www.who.int/news-room/speeches/item/who-director-general-s-opening-remarks-at-the-media-briefing---5-may-2023', '2023-05-05T00:00:00'),
    realArt('NASA\'s Bennu Asteroid Sample Contains Carbon, Water', 'nasa.gov', 'United States',
      'https://www.nasa.gov/news-release/nasas-bennu-asteroid-sample-contains-carbon-water/', '2023-10-11T00:00:00'),
    realArt('Chandrayaan-3 — India\'s moon landing mission', 'isro.gov.in', 'India',
      'https://www.isro.gov.in/Chandrayaan3.html', '2023-08-23T00:00:00'),
    realArt('Touch down — asteroid Bennu sample successfully lands on Earth', 'canada.ca', 'Canada',
      'https://www.canada.ca/en/space-agency/news/2023/09/touch-down---asteroid-bennu-sample-successfully-lands-on-earth.html', '2023-09-24T00:00:00'),
    realArt('NASA\'s First Asteroid Sample Has Landed, Now Secure in Clean Room', 'nasa.gov', 'United States',
      'https://www.nasa.gov/news-release/nasas-first-asteroid-sample-has-landed-now-secure-in-clean-room/', '2023-09-24T00:00:00'),
  ],
  protest: [
    realArt('Security Council demands immediate ceasefire in Gaza', 'un.org', 'United States',
      'https://press.un.org/en/2024/sc15641.doc.htm', '2024-03-25T00:00:00'),
    realArt('Death toll climbs as Cyclone Freddy slams Malawi, Mozambique', 'apnews.com', 'United States',
      'https://apnews.com/article/cyclone-freddy-mozambique-malawi-disaster-774c2ecd3baad9eb29dc227a15bd8b30', '2023-03-13T00:00:00'),
    realArt('A/RES/78/265 — AI systems for sustainable development', 'un.org', 'United States',
      'https://docs.un.org/en/A/res/78/265', '2024-04-01T00:00:00'),
    realArt('WHO Director-General: end of COVID-19 as a global health emergency', 'who.int', 'Switzerland',
      'https://www.who.int/news-room/speeches/item/who-director-general-s-opening-remarks-at-the-media-briefing---5-may-2023', '2023-05-05T00:00:00'),
    realArt('NASA Analysis Confirms 2023 as Warmest Year on Record', 'nasa.gov', 'United States',
      'https://www.nasa.gov/news-release/nasa-analysis-confirms-2023-as-warmest-year-on-record/', '2024-01-11T00:00:00'),
    realArt('World had warmest January on record', 'wmo.int', 'Switzerland',
      'https://wmo.int/media/news/world-had-warmest-january-record', '2024-02-15T00:00:00'),
    realArt('2023 was the world\'s warmest year on record, by far', 'noaa.gov', 'United States',
      'https://www.noaa.gov/news/2023-was-worlds-warmest-year-on-record-by-far', '2024-01-12T00:00:00'),
  ],
  wildfire: [
    realArt('Death toll from Maui wildfire reaches 89', 'apnews.com', 'United States',
      'https://apnews.com/article/maui-hawaii-fires-lahaina-destruction-evacuation-38ec0d6a5c610035a0a72b804fcdffe0', '2023-08-12T00:00:00'),
    realArt('Chile: Forest fire kills at least 46', 'apnews.com', 'Chile',
      'https://apnews.com/article/chile-forest-fires-430181f95724369f805779010450ee5f', '2024-02-04T00:00:00'),
    realArt('NASA Analysis Confirms 2023 as Warmest Year on Record', 'nasa.gov', 'United States',
      'https://www.nasa.gov/news-release/nasa-analysis-confirms-2023-as-warmest-year-on-record/', '2024-01-11T00:00:00'),
    realArt('2023 was the world\'s warmest year on record, by far', 'noaa.gov', 'United States',
      'https://www.noaa.gov/news/2023-was-worlds-warmest-year-on-record-by-far', '2024-01-12T00:00:00'),
    realArt('World had warmest January on record', 'wmo.int', 'Switzerland',
      'https://wmo.int/media/news/world-had-warmest-january-record', '2024-02-15T00:00:00'),
    realArt('Death toll climbs as Cyclone Freddy slams Malawi, Mozambique', 'apnews.com', 'United States',
      'https://apnews.com/article/cyclone-freddy-mozambique-malawi-disaster-774c2ecd3baad9eb29dc227a15bd8b30', '2023-03-13T00:00:00'),
  ],
  earthquake: [
    realArt('Powerful quake in Morocco kills more than 2,000 people', 'apnews.com', 'Morocco',
      'https://apnews.com/article/morocco-earthquake-marraskesh-7f4a503009dede0dec0208c08d6b100b', '2023-09-09T00:00:00'),
    realArt('5.9 magnitude earthquake strikes north-central Japan', 'apnews.com', 'Japan',
      'https://apnews.com/article/japan-earthquake-ishikawa-6980c18b070a6b63dd5f28dbac081c5e', '2024-06-02T00:00:00'),
    realArt('Death toll climbs as Cyclone Freddy slams Malawi, Mozambique', 'apnews.com', 'United States',
      'https://apnews.com/article/cyclone-freddy-mozambique-malawi-disaster-774c2ecd3baad9eb29dc227a15bd8b30', '2023-03-13T00:00:00'),
    realArt('Chile: Forest fire kills at least 46', 'apnews.com', 'Chile',
      'https://apnews.com/article/chile-forest-fires-430181f95724369f805779010450ee5f', '2024-02-04T00:00:00'),
    realArt('NASA Analysis Confirms 2023 as Warmest Year on Record', 'nasa.gov', 'United States',
      'https://www.nasa.gov/news-release/nasa-analysis-confirms-2023-as-warmest-year-on-record/', '2024-01-11T00:00:00'),
    realArt('WHO Director-General: end of COVID-19 as a global health emergency', 'who.int', 'Switzerland',
      'https://www.who.int/news-room/speeches/item/who-director-general-s-opening-remarks-at-the-media-briefing---5-may-2023', '2023-05-05T00:00:00'),
  ],
  flood: [
    realArt('Death toll climbs as Cyclone Freddy slams Malawi, Mozambique', 'apnews.com', 'Malawi',
      'https://apnews.com/article/cyclone-freddy-mozambique-malawi-disaster-774c2ecd3baad9eb29dc227a15bd8b30', '2023-03-13T00:00:00'),
    realArt('Powerful quake in Morocco kills more than 2,000 people', 'apnews.com', 'Morocco',
      'https://apnews.com/article/morocco-earthquake-marraskesh-7f4a503009dede0dec0208c08d6b100b', '2023-09-09T00:00:00'),
    realArt('Death toll from Maui wildfire reaches 89', 'apnews.com', 'United States',
      'https://apnews.com/article/maui-hawaii-fires-lahaina-destruction-evacuation-38ec0d6a5c610035a0a72b804fcdffe0', '2023-08-12T00:00:00'),
    realArt('World had warmest January on record', 'wmo.int', 'Switzerland',
      'https://wmo.int/media/news/world-had-warmest-january-record', '2024-02-15T00:00:00'),
    realArt('2023 was the world\'s warmest year on record, by far', 'noaa.gov', 'United States',
      'https://www.noaa.gov/news/2023-was-worlds-warmest-year-on-record-by-far', '2024-01-12T00:00:00'),
    realArt('NASA Analysis Confirms 2023 as Warmest Year on Record', 'nasa.gov', 'United States',
      'https://www.nasa.gov/news-release/nasa-analysis-confirms-2023-as-warmest-year-on-record/', '2024-01-11T00:00:00'),
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