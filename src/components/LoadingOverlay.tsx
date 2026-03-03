/**
 * Loading indicator — thin top progress bar + small floating toast.
 *
 * NEVER blocks the full screen. The user can always interact with
 * the map and read whatever data is already loaded.
 */

import { useStore } from '../store';
import './LoadingOverlay.css';

export function LoadingOverlay() {
  const isLoading = useStore((s) => s.isLoading);
  const usingDemoData = useStore((s) => s.usingDemoData);
  const hasData = useStore((s) => s.geoFeatures.length > 0 || s.articles.length > 0);

  // Top bar while any fetch is in flight
  const showBar = isLoading;

  // Small floating toast (not full-screen!) when loading & no data yet
  const showToast = isLoading && !hasData;

  return (
    <>
      {showBar && (
        <div className="loading-overlay" role="progressbar" aria-label="Loading data">
          <div className="loading-bar" />
        </div>
      )}

      {showToast && (
        <div className="loading-toast" role="status">
          <div className="lt-spinner" />
          <div className="lt-text">
            <span className="lt-title">Loading news data…</span>
            <span className="lt-sub">
              {usingDemoData
                ? 'Falling back to cached data'
                : 'Connecting to news sources'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
