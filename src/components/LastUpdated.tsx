/**
 * Shows the live refresh timestamp + a pulsing dot to indicate freshness.
 */

import { useStore } from '../store';
import './LastUpdated.css';

export function LastUpdated() {
  const lastUpdated = useStore((s) => s.lastUpdated);
  const isLoading  = useStore((s) => s.isLoading);

  const fmt = (ts: number) =>
    new Date(ts).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  return (
    <div className="last-updated">
      <span className={`pulse-dot ${isLoading ? 'loading' : ''}`} />
      <span className="lu-label">Updated</span>
      <span className="lu-time">{fmt(lastUpdated)}</span>
    </div>
  );
}
