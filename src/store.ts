/**
 * Global state management using Zustand
 * Reference: https://github.com/pmndrs/zustand
 *
 * Single source-of-truth for:
 *  - active channel & search query
 *  - selected time window
 *  - GDELT data (geo features, articles, timeline)
 *  - derived data (top locations)
 *  - interaction state (selected location, loading flag)
 */

import { create } from 'zustand';
import type { TimeWindow, GeoFeature, GdeltArticle, TimelinePoint, TopLocation } from './types';
import type { Channel } from './data/channels';
import { CHANNELS } from './data/channels';
import {
  fetchGeoData,
  fetchArticles,
  fetchTimeline,
  deriveTopLocations,
} from './data/gdeltApi';

interface AppState {
  /* ---- Theme ---- */
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  /* ---- Inputs ---- */
  activeChannel: Channel;
  setActiveChannel: (ch: Channel) => void;

  timeWindow: TimeWindow;
  setTimeWindow: (tw: TimeWindow) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  /* ---- GDELT data ---- */
  geoFeatures: GeoFeature[];
  articles: GdeltArticle[];
  timelineData: TimelinePoint[];
  topLocations: TopLocation[];

  /* ---- UI state ---- */
  isLoading: boolean;
  lastUpdated: number;

  selectedLocation: string | null; // name of clicked location
  setSelectedLocation: (name: string | null) => void;

  /* ---- Actions ---- */
  /** Fetch all data from GDELT for current channel + window + search */
  refreshData: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  /* ---- theme ---- */
  theme: ((typeof window !== 'undefined'
    ? localStorage.getItem('fluxmap-theme')
    : null) ?? 'dark') as 'dark' | 'light',
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('fluxmap-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    set({ theme: next });
  },

  /* ---- defaults ---- */
  activeChannel: CHANNELS[0],
  setActiveChannel: (ch) => {
    set({ activeChannel: ch });
  },

  timeWindow: '1h',
  setTimeWindow: (tw) => set({ timeWindow: tw }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),

  geoFeatures: [],
  articles: [],
  timelineData: [],
  topLocations: [],

  isLoading: false,
  lastUpdated: Date.now(),

  selectedLocation: null,
  setSelectedLocation: (name) => set({ selectedLocation: name }),

  refreshData: async () => {
    const { activeChannel, timeWindow, searchQuery } = get();
    set({ isLoading: true });

    try {
      // All three calls go through /api/ proxy (Vercel Edge cached).
      // The proxy avoids GDELT per-IP rate limit, so we can parallelize.
      const [geo, arts, tl] = await Promise.all([
        fetchGeoData(activeChannel.query, timeWindow, searchQuery),
        fetchArticles(activeChannel.query, timeWindow, searchQuery),
        fetchTimeline(activeChannel.query, timeWindow, searchQuery),
      ]);

      const topLocs = deriveTopLocations(geo, 10);

      set({
        geoFeatures: geo,
        articles: arts,
        timelineData: tl,
        topLocations: topLocs,
        lastUpdated: Date.now(),
      });
    } catch (err) {
      console.error('[FluxMap] refreshData failed:', err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
