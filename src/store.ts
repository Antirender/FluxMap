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
} from './data/gdeltApi';
import {
  getDemoGeo,
  getDemoArticles,
  getDemoTimeline,
  getDemoTopLocations,
} from './data/demoData';
import { fetchAllData } from './data/providerChain';
import type { StoryStepData } from './data/storyData';

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
  usingDemoData: boolean;
  dataSource: 'gdelt' | 'newsdata' | 'cache' | 'demo' | null;
  errors: AppError[];
  pushError: (msg: string) => void;
  dismissError: (id: number) => void;

  selectedLocation: string | null;
  setSelectedLocation: (name: string | null) => void;

  /* ---- Actions ---- */
  refreshData: () => Promise<void>;
  /** Inject pre-built static data (for Story page — no API needed) */
  injectStoryData: (data: StoryStepData) => void;
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
  usingDemoData: false,
  dataSource: null,

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

  injectStoryData: (data) => {
    set({
      geoFeatures: data.geo,
      articles: data.articles,
      timelineData: data.timeline,
      topLocations: data.topLocations,
      lastUpdated: Date.now(),
      usingDemoData: false,
      isLoading: false,
    });
  },

  refreshData: async () => {
    const { activeChannel, timeWindow, searchQuery, pushError } = get();
    set({ isLoading: true });

    try {
      // Multi-source provider chain: GDELT → NewsData.io → cache → demo
      const result = await fetchAllData(
        activeChannel.id,
        activeChannel.query,
        timeWindow,
        searchQuery,
      );

      const isDemoOrCache = result.source === 'demo' || result.source === 'cache';

      if (result.source === 'demo') {
        pushError('All news APIs unreachable — showing demo data');
      } else if (result.source === 'cache') {
        pushError('Using cached data — live sources temporarily unavailable');
      } else if (result.source === 'newsdata') {
        // Don't show error — NewsData is a valid live source
        console.log('[FluxMap] Using NewsData.io as data source');
      }

      set({
        geoFeatures: result.geo,
        articles: result.articles,
        timelineData: result.timeline,
        topLocations: result.topLocations,
        lastUpdated: Date.now(),
        usingDemoData: isDemoOrCache,
        dataSource: result.source,
      });
    } catch (err) {
      console.error('[FluxMap] refreshData failed:', err);
      // Total crash — fall back to demo data
      const chId = get().activeChannel.id;
      pushError('Data refresh failed — showing demo data');
      set({
        geoFeatures: getDemoGeo(chId),
        articles: getDemoArticles(chId),
        timelineData: getDemoTimeline(chId),
        topLocations: getDemoTopLocations(chId, 10),
        lastUpdated: Date.now(),
        usingDemoData: true,
        dataSource: 'demo',
      });
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
