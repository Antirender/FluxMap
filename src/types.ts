/**
 * Core type definitions for FluxMap – GDELT-powered news radar
 */

/* ---- Time ---- */
export type TimeWindow = '15m' | '1h' | '6h' | '24h' | '7d';

/* ---- GeoJSON feature from GDELT GEO 2.0 API ---- */
export interface GeoFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    name: string;
    count: number;
    shareimage?: string;
    html?: string;
    [key: string]: unknown; // GDELT may add extra fields
  };
}

/* ---- Article from GDELT DOC 2.0 API (ArtList mode) ---- */
export interface GdeltArticle {
  url: string;
  url_mobile: string;
  title: string;
  seendate: string;       // e.g. "20260216T120000Z"
  socialimage: string;
  domain: string;
  language: string;
  sourcecountry: string;
}

/* ---- Timeline data point (DOC TimelineVol mode) ---- */
export interface TimelinePoint {
  date: string;  // label returned by GDELT (e.g. "February 16, 2026")
  value: number; // article volume
}

/* ---- Derived: top location aggregate ---- */
export interface TopLocation {
  name: string;
  count: number;
  lat: number;
  lng: number;
}

/* ---- Map view state for deck.gl ---- */
export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}
