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
  art('NASA Analysis Confirms 2023 as Warmest Year on Record', 'nasa.gov', 'United States', 'https://www.nasa.gov/news-release/nasa-analysis-confirms-2023-as-warmest-year-on-record/', '20240111T000000Z'),
  art('2023 was the world\'s warmest year on record, by far', 'noaa.gov', 'United States', 'https://www.noaa.gov/news/2023-was-worlds-warmest-year-on-record-by-far', '20240112T000000Z'),
  art('World had warmest January on record', 'wmo.int', 'Switzerland', 'https://wmo.int/media/news/world-had-warmest-january-record', '20240215T000000Z'),
  art('Security Council demands immediate ceasefire in Gaza', 'un.org', 'United States', 'https://press.un.org/en/2024/sc15641.doc.htm', '20240325T000000Z'),
  art('WHO Director-General: end of COVID-19 as a global health emergency', 'who.int', 'Switzerland', 'https://www.who.int/news-room/speeches/item/who-director-general-s-opening-remarks-at-the-media-briefing---5-may-2023', '20230505T000000Z'),
  art('NASA\'s Bennu Asteroid Sample Contains Carbon, Water', 'nasa.gov', 'United States', 'https://www.nasa.gov/news-release/nasas-bennu-asteroid-sample-contains-carbon-water/', '20231011T000000Z'),
  art('Chandrayaan-3 — India\'s moon landing mission', 'isro.gov.in', 'India', 'https://www.isro.gov.in/Chandrayaan3.html', '20230823T000000Z'),
  art('A/RES/78/265 — AI systems for sustainable development', 'un.org', 'United States', 'https://docs.un.org/en/A/res/78/265', '20240401T000000Z'),
  art('Touch down — asteroid Bennu sample lands on Earth', 'canada.ca', 'Canada', 'https://www.canada.ca/en/space-agency/news/2023/09/touch-down---asteroid-bennu-sample-successfully-lands-on-earth.html', '20230924T000000Z'),
  art('NASA\'s First Asteroid Sample Has Landed', 'nasa.gov', 'United States', 'https://www.nasa.gov/news-release/nasas-first-asteroid-sample-has-landed-now-secure-in-clean-room/', '20230924T000000Z'),
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
  art('Security Council demands immediate ceasefire in Gaza', 'un.org', 'United States', 'https://press.un.org/en/2024/sc15641.doc.htm', '20240325T000000Z'),
  art('Death toll climbs as Cyclone Freddy slams Malawi, Mozambique', 'apnews.com', 'United States', 'https://apnews.com/article/cyclone-freddy-mozambique-malawi-disaster-774c2ecd3baad9eb29dc227a15bd8b30', '20230313T000000Z'),
  art('WHO Director-General: end of COVID-19 as a global health emergency', 'who.int', 'Switzerland', 'https://www.who.int/news-room/speeches/item/who-director-general-s-opening-remarks-at-the-media-briefing---5-may-2023', '20230505T000000Z'),
  art('A/RES/78/265 — AI systems for sustainable development', 'un.org', 'United States', 'https://docs.un.org/en/A/res/78/265', '20240401T000000Z'),
  art('NASA Analysis Confirms 2023 as Warmest Year on Record', 'nasa.gov', 'United States', 'https://www.nasa.gov/news-release/nasa-analysis-confirms-2023-as-warmest-year-on-record/', '20240111T000000Z'),
  art('World had warmest January on record', 'wmo.int', 'Switzerland', 'https://wmo.int/media/news/world-had-warmest-january-record', '20240215T000000Z'),
  art('2023 was the world\'s warmest year on record, by far', 'noaa.gov', 'United States', 'https://www.noaa.gov/news/2023-was-worlds-warmest-year-on-record-by-far', '20240112T000000Z'),
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
  art('Death toll from Maui wildfire reaches 89', 'apnews.com', 'United States', 'https://apnews.com/article/maui-hawaii-fires-lahaina-destruction-evacuation-38ec0d6a5c610035a0a72b804fcdffe0', '20230812T000000Z'),
  art('Chile: Forest fire kills at least 46', 'apnews.com', 'Chile', 'https://apnews.com/article/chile-forest-fires-430181f95724369f805779010450ee5f', '20240204T000000Z'),
  art('NASA Analysis Confirms 2023 as Warmest Year on Record', 'nasa.gov', 'United States', 'https://www.nasa.gov/news-release/nasa-analysis-confirms-2023-as-warmest-year-on-record/', '20240111T000000Z'),
  art('2023 was the world\'s warmest year on record, by far', 'noaa.gov', 'United States', 'https://www.noaa.gov/news/2023-was-worlds-warmest-year-on-record-by-far', '20240112T000000Z'),
  art('World had warmest January on record', 'wmo.int', 'Switzerland', 'https://wmo.int/media/news/world-had-warmest-january-record', '20240215T000000Z'),
  art('Death toll climbs as Cyclone Freddy slams Malawi, Mozambique', 'apnews.com', 'United States', 'https://apnews.com/article/cyclone-freddy-mozambique-malawi-disaster-774c2ecd3baad9eb29dc227a15bd8b30', '20230313T000000Z'),
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
  art('A/RES/78/265 — AI systems for sustainable development', 'un.org', 'United States', 'https://docs.un.org/en/A/res/78/265', '20240401T000000Z'),
  art('NASA\'s Bennu Asteroid Sample Contains Carbon, Water', 'nasa.gov', 'United States', 'https://www.nasa.gov/news-release/nasas-bennu-asteroid-sample-contains-carbon-water/', '20231011T000000Z'),
  art('Chandrayaan-3 — India\'s moon landing mission', 'isro.gov.in', 'India', 'https://www.isro.gov.in/Chandrayaan3.html', '20230823T000000Z'),
  art('NASA\'s First Asteroid Sample Has Landed', 'nasa.gov', 'United States', 'https://www.nasa.gov/news-release/nasas-first-asteroid-sample-has-landed-now-secure-in-clean-room/', '20230924T000000Z'),
  art('Touch down — asteroid Bennu sample lands on Earth', 'canada.ca', 'Canada', 'https://www.canada.ca/en/space-agency/news/2023/09/touch-down---asteroid-bennu-sample-successfully-lands-on-earth.html', '20230924T000000Z'),
  art('WHO Director-General: end of COVID-19 as a global health emergency', 'who.int', 'Switzerland', 'https://www.who.int/news-room/speeches/item/who-director-general-s-opening-remarks-at-the-media-briefing---5-may-2023', '20230505T000000Z'),
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
