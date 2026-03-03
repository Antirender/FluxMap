/**
 * Explore page – Professional dashboard with linked views.
 *
 * Layout (desktop ≥ 1200 px):
 *  ┌─────────────────────────────────────────────────────────┐
 *  │ [Channels]  [Time: 15m 1h 6h 24h 7d]  [Search]  [Upd] │
 *  ├───────────────────────────┬─────────────────────────────┤
 *  │                           │  Trend Chart                │
 *  │       MAP (main)          ├─────────────────────────────┤
 *  │                           │  Top Locations              │
 *  ├───────────────────────────┴─────────────────────────────┤
 *  │  Articles (scrollable)                                  │
 *  └─────────────────────────────────────────────────────────┘
 */

import { useEffect, useRef } from 'react';
import { MapView } from '../components/MapView';
import { TrendChart } from '../components/TrendChart';
import { TopList } from '../components/TopList';
import { ArticleEvidence } from '../components/ArticleEvidence';
import { ChannelSelector } from '../components/ChannelSelector';
import { TimeWindowSwitcher } from '../components/TimeWindowSwitcher';
import { SearchInput } from '../components/SearchInput';
import { LastUpdated } from '../components/LastUpdated';
import { useStore } from '../store';
import './Explore.css';

export function Explore() {
  const refreshData = useStore((s) => s.refreshData);
  const prefetchNeighbors = useStore((s) => s.prefetchNeighbors);
  const timeWindow = useStore((s) => s.timeWindow);
  const activeChannel = useStore((s) => s.activeChannel);
  const searchQuery = useStore((s) => s.searchQuery);
  const selectedLocation = useStore((s) => s.selectedLocation);
  const setSelectedLocation = useStore((s) => s.setSelectedLocation);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const usingDemoData = useStore((s) => s.usingDemoData);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasFilters = !!selectedLocation || !!searchQuery;

  /* initial fetch + auto-refresh 60 s */
  useEffect(() => {
    refreshData().then(() => prefetchNeighbors());
    intervalRef.current = setInterval(() => {
      refreshData().then(() => prefetchNeighbors());
    }, 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* re-fetch when inputs change */
  useEffect(() => {
    refreshData().then(() => prefetchNeighbors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeWindow, activeChannel, searchQuery]);

  return (
    <div className="explore-page">
      {/* Demo data banner */}
      {usingDemoData && (
        <div className="demo-banner">
          ⚠️ GDELT API is currently unreachable — showing demo data.
          The app will automatically switch to live data when the API recovers.
        </div>
      )}

      {/* toolbar */}
      <div className="explore-toolbar">
        <ChannelSelector />
        <div className="explore-toolbar-right">
          <TimeWindowSwitcher />
          <SearchInput />
          {hasFilters && (
            <button
              className="explore-reset-btn"
              onClick={() => {
                setSelectedLocation(null);
                setSearchQuery('');
              }}
              title="Reset to overview"
            >
              ↩ Reset
            </button>
          )}
          <LastUpdated />
        </div>
      </div>

      {/* main grid */}
      <div className="explore-grid">
        <div className="explore-map">
          <MapView />

          {/* floating map legend */}
          <div className="explore-legend">
            <div className="legend-row">
              <span className="legend-swatch legend-heat" />
              <span>Heatmap — media attention density</span>
            </div>
            <div className="legend-row">
              <span
                className="legend-dot"
                style={{ background: activeChannel.color }}
              />
              <span>Dot — geo-located article cluster</span>
            </div>
            <div className="legend-row">
              <span className="legend-dot legend-dot-selected" />
              <span>Selected location</span>
            </div>
          </div>
        </div>

        <div className="explore-sidebar">
          <div className="explore-panel explore-trend">
            <TrendChart />
          </div>
          <div className="explore-panel explore-toplist">
            <TopList />
          </div>
        </div>

        <div className="explore-panel explore-articles">
          <ArticleEvidence />
        </div>
      </div>
    </div>
  );
}
