/**
 * Top loading bar + optional "first load" full-screen skeleton
 */

import { useStore } from '../store';
import './LoadingOverlay.css';

export function LoadingOverlay() {
  const isLoading = useStore((s) => s.isLoading);
  const lastUpdated = useStore((s) => s.lastUpdated);
  const hasData = useStore((s) => s.geoFeatures.length > 0 || s.articles.length > 0);

  // Always show the thin top bar while loading
  const showBar = isLoading;
  // Show full-screen skeleton only on the very first load (no data yet)
  const showSkeleton = isLoading && !hasData && Date.now() - lastUpdated < 3_000;

  return (
    <>
      {showBar && (
        <div className="loading-overlay" role="progressbar" aria-label="Loading data">
          <div className="loading-bar" />
        </div>
      )}

      {showSkeleton && (
        <div className="loading-skeleton">
          <div className="ls-content">
            <div className="ls-spinner" />
            <p className="ls-text">Loading global news data…</p>
            <p className="ls-sub">Connecting to GDELT API</p>
          </div>
        </div>
      )}
    </>
  );
}
