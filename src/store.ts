/**
 * Global state management using Zustand
 *
 * Single source-of-truth for:
 *  - active channel & search query
 *  - selected time window
 *  - GDELT data (geo features, articles, timeline)
 *  - derived data (top locations)
 *  - interaction state (selected location, loading flag, errors)
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

/** Toast-style error that auto-dismisses */
export interface AppError {
  id: number;
  message: string;
  ts: number;
}

let errorIdCounter = 0;

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
  errors: AppError[];
  pushError: (msg: string) => void;
  dismissError: (id: number) => void;

  selectedLocation: string | null;
  setSelectedLocation: (name: string | null) => void;

  /* ---- Actions ---- */
  refreshData: () => Promise<void>;
  /** Prefetch adjacent time windows in the background */
  prefetchNeighbors: () => void;
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
  setActiveChannel: (ch) => set({ activeChannel: ch }),

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

  /* ---- error toasts ---- */
  errors: [],
  pushError: (msg) => {
    const id = ++errorIdCounter;
    set((s) => ({ errors: [...s.errors, { id, message: msg, ts: Date.now() }] }));
    // Auto-dismiss after 6 s
    setTimeout(() => {
      set((s) => ({ errors: s.errors.filter((e) => e.id !== id) }));
    }, 6_000);
  },
  dismissError: (id) => {
    set((s) => ({ errors: s.errors.filter((e) => e.id !== id) }));
  },

  selectedLocation: null,
  setSelectedLocation: (name) => set({ selectedLocation: name }),

  refreshData: async () => {
    const { activeChannel, timeWindow, searchQuery, pushError } = get();
    set({ isLoading: true });

    try {
      // Promise.allSettled — one failure won't kill the rest
      const [geoResult, artsResult, tlResult] = await Promise.allSettled([
        fetchGeoData(activeChannel.query, timeWindow, searchQuery),
        fetchArticles(activeChannel.query, timeWindow, searchQuery),
        fetchTimeline(activeChannel.query, timeWindow, searchQuery),
      ]);

      const geo = geoResult.status === 'fulfilled' ? geoResult.value : [];
      const arts = artsResult.status === 'fulfilled' ? artsResult.value : [];
      const tl = tlResult.status === 'fulfilled' ? tlResult.value : [];

      // Report individual failures without crashing
      if (geoResult.status === 'rejected') {
        console.error('[FluxMap] GEO failed:', geoResult.reason);
        pushError('Map data unavailable — retrying next cycle');
      }
      if (artsResult.status === 'rejected') {
        console.error('[FluxMap] Articles failed:', artsResult.reason);
        pushError('Article list unavailable — retrying next cycle');
      }
      if (tlResult.status === 'rejected') {
        console.error('[FluxMap] Timeline failed:', tlResult.reason);
        pushError('Trend chart unavailable — retrying next cycle');
      }

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
      pushError('Data refresh failed — check your connection');
    } finally {
      set({ isLoading: false });
    }
  },

  /** Warm cache for adjacent time windows so switching feels instant */
  prefetchNeighbors: () => {
    const { activeChannel, timeWindow, searchQuery } = get();
    const windows: TimeWindow[] = ['15m', '1h', '6h', '24h', '7d'];
    const idx = windows.indexOf(timeWindow);
    const neighbors = [windows[idx - 1], windows[idx + 1]].filter(Boolean) as TimeWindow[];

    for (const tw of neighbors) {
      // Fire-and-forget; results land in the client LRU cache
      fetchGeoData(activeChannel.query, tw, searchQuery).catch(() => {});
      fetchArticles(activeChannel.query, tw, searchQuery).catch(() => {});
      fetchTimeline(activeChannel.query, tw, searchQuery).catch(() => {});
    }
  },
}));
