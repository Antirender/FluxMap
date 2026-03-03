/**
 * Static data for the Story (scrollytelling) page.
 *
 * This file is bundled at BUILD TIME so the Story page NEVER
 * depends on any live API. Even if every news source is down,
 * the onboarding narrative plays perfectly.
 *
 * Each step has its own geo points, articles, timeline, and
 * top locations — pre-baked for instant rendering.
 */

import type { GeoFeature, GdeltArticle, TimelinePoint, TopLocation } from '../types';

/* ── Helpers ── */

function pt(lng: number, lat: number, name: string, count: number): GeoFeature {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
    properties: { name, count, shareimage: '', html: '' },
  };
}

function art(
  title: string,
  domain: string,
  country: string,
  url: string,
  seendate: string,
): GdeltArticle {
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

/* ── Per-step static snapshot ── */

export interface StoryStepData {
  geo: GeoFeature[];
  articles: GdeltArticle[];
  timeline: TimelinePoint[];
  topLocations: TopLocation[];
}

/* ---------- Step 1 & 2: All News – 24 h ---------- */

const allGeo: GeoFeature[] = [
  pt(-77.04, 38.90, 'Washington, D.C., United States', 312),
  pt(-73.94, 40.67, 'New York, United States', 287),
  pt(-0.12,  51.51, 'London, United Kingdom', 254),
  pt(2.35,   48.86, 'Paris, France', 198),
  pt(139.69, 35.69, 'Tokyo, Japan', 176),
  pt(116.40, 39.90, 'Beijing, China', 168),
  pt(77.21,  28.61, 'New Delhi, India', 155),
  pt(37.62,  55.75, 'Moscow, Russia', 122),
  pt(13.41,  52.52, 'Berlin, Germany', 118),
  pt(28.98,  41.01, 'Istanbul, Turkey', 110),
  pt(-118.24,34.05, 'Los Angeles, United States', 145),
  pt(151.21,-33.87, 'Sydney, Australia', 98),
  pt(-43.17,-22.91, 'Rio de Janeiro, Brazil', 87),
  pt(31.24,  30.04, 'Cairo, Egypt', 82),
  pt(126.98, 37.57, 'Seoul, South Korea', 130),
  pt(-3.70,  40.42, 'Madrid, Spain', 76),
  pt(100.50, 13.75, 'Bangkok, Thailand', 65),
  pt(-99.13, 19.43, 'Mexico City, Mexico', 72),
  pt(44.42,  33.31, 'Baghdad, Iraq', 55),
  pt(36.28,  33.51, 'Damascus, Syria', 48),
  pt(-79.38, 43.65, 'Toronto, Canada', 93),
  pt(24.94,  60.17, 'Helsinki, Finland', 42),
  pt(12.49,  41.88, 'Rome, Italy', 64),
  pt(-58.38,-34.60, 'Buenos Aires, Argentina', 58),
  pt(106.85, -6.21, 'Jakarta, Indonesia', 68),
];

const allArticles: GdeltArticle[] = [
  art('Global leaders convene emergency summit on climate action plan', 'reuters.com', 'United States', 'https://reuters.com/world/climate-summit-2026', '20260303T060000Z'),
  art('Stock markets rally across Asia on positive economic data', 'bbc.com', 'United Kingdom', 'https://bbc.com/business/markets-rally', '20260303T053000Z'),
  art('European Union proposes sweeping AI regulation framework', 'theguardian.com', 'United Kingdom', 'https://theguardian.com/tech/eu-ai-regulation', '20260303T050000Z'),
  art('NASA announces updated timeline for crewed Mars mission', 'nytimes.com', 'United States', 'https://nytimes.com/science/mars-mission', '20260303T044500Z'),
  art('Healthcare reform bill advances through key committee vote', 'washingtonpost.com', 'United States', 'https://washingtonpost.com/politics/healthcare', '20260303T040000Z'),
  art('Tech giants report record quarterly earnings amid AI boom', 'cnbc.com', 'United States', 'https://cnbc.com/earnings/tech-q4', '20260303T034500Z'),
  art('Renewable energy investment hits $500 billion globally', 'ft.com', 'United Kingdom', 'https://ft.com/energy/renewables-record', '20260303T030000Z'),
  art('Trade talks resume as tariff tensions ease between powers', 'aljazeera.com', 'Qatar', 'https://aljazeera.com/economy/trade-talks', '20260303T023000Z'),
  art('Breakthrough in quantum computing achieved by research team', 'nature.com', 'United Kingdom', 'https://nature.com/articles/quantum-computing', '20260303T020000Z'),
  art('Global shipping disruptions continue amid regional tensions', 'bloomberg.com', 'United States', 'https://bloomberg.com/shipping-disruptions', '20260303T013000Z'),
];

const allTimeline: TimelinePoint[] = [
  { date: 'March 2, 2026 00:00', value: 145 },
  { date: 'March 2, 2026 01:00', value: 132 },
  { date: 'March 2, 2026 02:00', value: 118 },
  { date: 'March 2, 2026 03:00', value: 105 },
  { date: 'March 2, 2026 04:00', value: 98 },
  { date: 'March 2, 2026 05:00', value: 92 },
  { date: 'March 2, 2026 06:00', value: 110 },
  { date: 'March 2, 2026 07:00', value: 135 },
  { date: 'March 2, 2026 08:00', value: 168 },
  { date: 'March 2, 2026 09:00', value: 195 },
  { date: 'March 2, 2026 10:00', value: 220 },
  { date: 'March 2, 2026 11:00', value: 245 },
  { date: 'March 2, 2026 12:00', value: 258 },
  { date: 'March 2, 2026 13:00', value: 262 },
  { date: 'March 2, 2026 14:00', value: 248 },
  { date: 'March 2, 2026 15:00', value: 238 },
  { date: 'March 2, 2026 16:00', value: 225 },
  { date: 'March 2, 2026 17:00', value: 215 },
  { date: 'March 2, 2026 18:00', value: 205 },
  { date: 'March 2, 2026 19:00', value: 192 },
  { date: 'March 2, 2026 20:00', value: 178 },
  { date: 'March 2, 2026 21:00', value: 168 },
  { date: 'March 2, 2026 22:00', value: 155 },
  { date: 'March 2, 2026 23:00', value: 148 },
];

const allTopLocations: TopLocation[] = [
  { name: 'Washington, D.C., United States', count: 312, lat: 38.90, lng: -77.04 },
  { name: 'New York, United States', count: 287, lat: 40.67, lng: -73.94 },
  { name: 'London, United Kingdom', count: 254, lat: 51.51, lng: -0.12 },
  { name: 'Paris, France', count: 198, lat: 48.86, lng: 2.35 },
  { name: 'Tokyo, Japan', count: 176, lat: 35.69, lng: 139.69 },
  { name: 'Beijing, China', count: 168, lat: 39.90, lng: 116.40 },
  { name: 'New Delhi, India', count: 155, lat: 28.61, lng: 77.21 },
  { name: 'Los Angeles, United States', count: 145, lat: 34.05, lng: -118.24 },
  { name: 'Seoul, South Korea', count: 130, lat: 37.57, lng: 126.98 },
  { name: 'Moscow, Russia', count: 122, lat: 55.75, lng: 37.62 },
];

/* ---------- Step 3: Protest ---------- */

const protestGeo: GeoFeature[] = [
  pt(2.35,   48.86, 'Paris, France', 95),
  pt(28.98,  41.01, 'Istanbul, Turkey', 82),
  pt(77.21,  28.61, 'New Delhi, India', 78),
  pt(-43.17,-22.91, 'Rio de Janeiro, Brazil', 65),
  pt(100.50, 13.75, 'Bangkok, Thailand', 72),
  pt(-77.04, 38.90, 'Washington, D.C., United States', 62),
  pt(-73.94, 40.67, 'New York, United States', 55),
  pt(31.24,  30.04, 'Cairo, Egypt', 58),
  pt(-3.70,  40.42, 'Madrid, Spain', 48),
  pt(13.41,  52.52, 'Berlin, Germany', 45),
  pt(-118.24,34.05, 'Los Angeles, United States', 42),
  pt(18.42, -33.92, 'Cape Town, South Africa', 35),
  pt(126.98, 37.57, 'Seoul, South Korea', 52),
  pt(-58.38,-34.60, 'Buenos Aires, Argentina', 38),
];

const protestArticles: GdeltArticle[] = [
  art('Thousands rally in Paris over pension reform proposals', 'reuters.com', 'France', 'https://reuters.com/world/paris-pension-protest', '20260303T055000Z'),
  art('Anti-government protests escalate across multiple Turkish cities', 'bbc.com', 'United Kingdom', 'https://bbc.com/news/turkey-protests', '20260303T050000Z'),
  art('Student demonstrations sweep university campuses in India', 'theguardian.com', 'United Kingdom', 'https://theguardian.com/world/india-student-protests', '20260303T044000Z'),
  art('Workers strike disrupts public transportation in São Paulo', 'aljazeera.com', 'Qatar', 'https://aljazeera.com/news/sao-paulo-strike', '20260303T040000Z'),
  art('Police deploy tear gas as rally turns violent in Bangkok', 'apnews.com', 'United States', 'https://apnews.com/bangkok-rally-teargas', '20260303T034000Z'),
  art('Thousands march through Berlin demanding climate action', 'dw.com', 'Germany', 'https://dw.com/en/berlin-climate-march', '20260303T030000Z'),
  art('Union leaders call for nationwide workers march in Argentina', 'reuters.com', 'Argentina', 'https://reuters.com/world/argentina-union-march', '20260303T024000Z'),
];

const protestTimeline: TimelinePoint[] = [
  { date: 'March 2, 2026 00:00', value: 38 },
  { date: 'March 2, 2026 02:00', value: 32 },
  { date: 'March 2, 2026 04:00', value: 28 },
  { date: 'March 2, 2026 06:00', value: 35 },
  { date: 'March 2, 2026 08:00', value: 52 },
  { date: 'March 2, 2026 10:00', value: 78 },
  { date: 'March 2, 2026 12:00', value: 95 },
  { date: 'March 2, 2026 14:00', value: 88 },
  { date: 'March 2, 2026 16:00', value: 72 },
  { date: 'March 2, 2026 18:00', value: 65 },
  { date: 'March 2, 2026 20:00', value: 55 },
  { date: 'March 2, 2026 22:00', value: 42 },
];

const protestTopLocations: TopLocation[] = [
  { name: 'Paris, France', count: 95, lat: 48.86, lng: 2.35 },
  { name: 'Istanbul, Turkey', count: 82, lat: 41.01, lng: 28.98 },
  { name: 'New Delhi, India', count: 78, lat: 28.61, lng: 77.21 },
  { name: 'Bangkok, Thailand', count: 72, lat: 13.75, lng: 100.50 },
  { name: 'Rio de Janeiro, Brazil', count: 65, lat: -22.91, lng: -43.17 },
  { name: 'Washington, D.C., United States', count: 62, lat: 38.90, lng: -77.04 },
  { name: 'Cairo, Egypt', count: 58, lat: 30.04, lng: 31.24 },
  { name: 'New York, United States', count: 55, lat: 40.67, lng: -73.94 },
  { name: 'Seoul, South Korea', count: 52, lat: 37.57, lng: 126.98 },
  { name: 'Madrid, Spain', count: 48, lat: 40.42, lng: -3.70 },
];

/* ---------- Step 4: Wildfire ---------- */

const wildfireGeo: GeoFeature[] = [
  pt(-118.24, 34.05, 'Los Angeles, United States', 105),
  pt(-122.42, 37.77, 'San Francisco, United States', 55),
  pt(151.21, -33.87, 'Sydney, Australia', 88),
  pt(149.13, -35.28, 'Canberra, Australia', 72),
  pt(23.73,  37.98, 'Athens, Greece', 62),
  pt(-8.61,  41.15, 'Porto, Portugal', 48),
  pt(28.98,  41.01, 'Istanbul, Turkey', 38),
  pt(12.49,  41.88, 'Rome, Italy', 32),
  pt(-79.38, 43.65, 'Toronto, Canada', 28),
  pt(-121.49, 38.58, 'Sacramento, United States', 68),
];

const wildfireArticles: GdeltArticle[] = [
  art('Wildfire spreads across Southern California hillsides, evacuations ordered', 'latimes.com', 'United States', 'https://latimes.com/wildfire-socal', '20260303T054000Z'),
  art('Firefighters battle unprecedented blazes in Australian bushland', 'abc.net.au', 'Australia', 'https://abc.net.au/news/bushfire-update', '20260303T045000Z'),
  art('Greece evacuates coastal towns as wildfires advance on villages', 'reuters.com', 'Greece', 'https://reuters.com/world/greece-wildfires', '20260303T040000Z'),
  art('Record temperatures fuel wildfire season across Western US', 'washingtonpost.com', 'United States', 'https://washingtonpost.com/climate/wildfires', '20260303T034000Z'),
  art('Portugal declares state of emergency as forest fires intensify', 'bbc.com', 'Portugal', 'https://bbc.com/news/portugal-fires', '20260303T030000Z'),
  art('Air quality warnings as wildfire smoke blankets major cities', 'cnn.com', 'United States', 'https://cnn.com/weather/smoke-warnings', '20260303T024000Z'),
];

const wildfireTimeline: TimelinePoint[] = [
  { date: 'March 2, 2026 00:00', value: 22 },
  { date: 'March 2, 2026 02:00', value: 25 },
  { date: 'March 2, 2026 04:00', value: 30 },
  { date: 'March 2, 2026 06:00', value: 38 },
  { date: 'March 2, 2026 08:00', value: 45 },
  { date: 'March 2, 2026 10:00', value: 58 },
  { date: 'March 2, 2026 12:00', value: 72 },
  { date: 'March 2, 2026 14:00', value: 85 },
  { date: 'March 2, 2026 16:00', value: 78 },
  { date: 'March 2, 2026 18:00', value: 62 },
  { date: 'March 2, 2026 20:00', value: 45 },
  { date: 'March 2, 2026 22:00', value: 35 },
];

const wildfireTopLocations: TopLocation[] = [
  { name: 'Los Angeles, United States', count: 105, lat: 34.05, lng: -118.24 },
  { name: 'Sydney, Australia', count: 88, lat: -33.87, lng: 151.21 },
  { name: 'Canberra, Australia', count: 72, lat: -35.28, lng: 149.13 },
  { name: 'Sacramento, United States', count: 68, lat: 38.58, lng: -121.49 },
  { name: 'Athens, Greece', count: 62, lat: 37.98, lng: 23.73 },
  { name: 'San Francisco, United States', count: 55, lat: 37.77, lng: -122.42 },
  { name: 'Porto, Portugal', count: 48, lat: 41.15, lng: -8.61 },
  { name: 'Istanbul, Turkey', count: 38, lat: 41.01, lng: 28.98 },
  { name: 'Rome, Italy', count: 32, lat: 41.88, lng: 12.49 },
  { name: 'Toronto, Canada', count: 28, lat: 43.65, lng: -79.38 },
];

/* ---------- Step 5: All News – 1 h (breaking) ---------- */

const breakingGeo: GeoFeature[] = [
  pt(-77.04, 38.90, 'Washington, D.C., United States', 45),
  pt(-73.94, 40.67, 'New York, United States', 38),
  pt(-0.12,  51.51, 'London, United Kingdom', 32),
  pt(139.69, 35.69, 'Tokyo, Japan', 28),
  pt(116.40, 39.90, 'Beijing, China', 22),
  pt(77.21,  28.61, 'New Delhi, India', 18),
  pt(2.35,   48.86, 'Paris, France', 15),
  pt(-118.24,34.05, 'Los Angeles, United States', 20),
];

const breakingTimeline: TimelinePoint[] = [
  { date: 'March 3, 2026 05:00', value: 28 },
  { date: 'March 3, 2026 05:15', value: 32 },
  { date: 'March 3, 2026 05:30', value: 38 },
  { date: 'March 3, 2026 05:45', value: 42 },
];

/* ---------- Step 6: Cyber ---------- */

const cyberGeo: GeoFeature[] = [
  pt(-77.04, 38.90, 'Washington, D.C., United States', 85),
  pt(-0.12,  51.51, 'London, United Kingdom', 72),
  pt(116.40, 39.90, 'Beijing, China', 58),
  pt(37.62,  55.75, 'Moscow, Russia', 65),
  pt(139.69, 35.69, 'Tokyo, Japan', 48),
  pt(13.41,  52.52, 'Berlin, Germany', 42),
  pt(126.98, 37.57, 'Seoul, South Korea', 55),
  pt(77.21,  28.61, 'New Delhi, India', 38),
  pt(24.94,  60.17, 'Helsinki, Finland', 28),
  pt(18.07,  59.33, 'Stockholm, Sweden', 25),
  pt(-122.33, 47.61,'Seattle, United States', 45),
  pt(-73.94, 40.67, 'New York, United States', 40),
];

const cyberArticles: GdeltArticle[] = [
  art('Major ransomware attack disrupts hospital systems across Europe', 'bbc.com', 'United Kingdom', 'https://bbc.com/news/cyber-hospital-attack', '20260303T052000Z'),
  art('US government agencies report coordinated cyber intrusion', 'washingtonpost.com', 'United States', 'https://washingtonpost.com/cybersecurity/breach', '20260303T045000Z'),
  art('Financial sector braces for escalating cyber threats in 2026', 'ft.com', 'United Kingdom', 'https://ft.com/cyber-threats-finance', '20260303T040000Z'),
  art('South Korea strengthens cyber defenses after attack surge', 'reuters.com', 'South Korea', 'https://reuters.com/tech/korea-cyber-defense', '20260303T034000Z'),
  art('Critical infrastructure vulnerability discovered in power grid software', 'wired.com', 'United States', 'https://wired.com/security/power-grid-vuln', '20260303T030000Z'),
  art('International coalition announces joint cyber deterrence framework', 'apnews.com', 'United States', 'https://apnews.com/cyber-coalition', '20260303T024000Z'),
];

const cyberTimeline: TimelinePoint[] = [
  { date: 'March 2, 2026 18:00', value: 28 },
  { date: 'March 2, 2026 19:00', value: 32 },
  { date: 'March 2, 2026 20:00', value: 45 },
  { date: 'March 2, 2026 21:00', value: 58 },
  { date: 'March 2, 2026 22:00', value: 52 },
  { date: 'March 2, 2026 23:00', value: 48 },
];

const cyberTopLocations: TopLocation[] = [
  { name: 'Washington, D.C., United States', count: 85, lat: 38.90, lng: -77.04 },
  { name: 'London, United Kingdom', count: 72, lat: 51.51, lng: -0.12 },
  { name: 'Moscow, Russia', count: 65, lat: 55.75, lng: 37.62 },
  { name: 'Beijing, China', count: 58, lat: 39.90, lng: 116.40 },
  { name: 'Seoul, South Korea', count: 55, lat: 37.57, lng: 126.98 },
  { name: 'Tokyo, Japan', count: 48, lat: 35.69, lng: 139.69 },
  { name: 'Seattle, United States', count: 45, lat: 47.61, lng: -122.33 },
  { name: 'Berlin, Germany', count: 42, lat: 52.52, lng: 13.41 },
  { name: 'New York, United States', count: 40, lat: 40.67, lng: -73.94 },
  { name: 'New Delhi, India', count: 38, lat: 28.61, lng: 77.21 },
];

/* ================================================================== */
/*  Export: step ID → data                                             */
/* ================================================================== */

export const STORY_DATA: Record<number, StoryStepData> = {
  // Step 1 & 2: All News 24 h
  1: { geo: allGeo, articles: allArticles, timeline: allTimeline, topLocations: allTopLocations },
  2: { geo: allGeo, articles: allArticles, timeline: allTimeline, topLocations: allTopLocations },
  // Step 3: Protest
  3: { geo: protestGeo, articles: protestArticles, timeline: protestTimeline, topLocations: protestTopLocations },
  // Step 4: Wildfire
  4: { geo: wildfireGeo, articles: wildfireArticles, timeline: wildfireTimeline, topLocations: wildfireTopLocations },
  // Step 5: Breaking (1 h window)
  5: { geo: breakingGeo, articles: allArticles.slice(0, 5), timeline: breakingTimeline, topLocations: allTopLocations.slice(0, 5) },
  // Step 6: Cyber
  6: { geo: cyberGeo, articles: cyberArticles, timeline: cyberTimeline, topLocations: cyberTopLocations },
  // Step 7: CTA – same as all
  7: { geo: allGeo, articles: allArticles, timeline: allTimeline, topLocations: allTopLocations },
};
