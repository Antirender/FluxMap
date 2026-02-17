/**
 * Top locations list – derived from GDELT GEO data.
 * Clicking a location filters the linked article list.
 */

import { useStore } from '../store';
import './TopList.css';

export function TopList() {
  const topLocations = useStore((s) => s.topLocations);
  const selectedLocation = useStore((s) => s.selectedLocation);
  const setSelectedLocation = useStore((s) => s.setSelectedLocation);
  const activeChannel = useStore((s) => s.activeChannel);

  return (
    <div className="top-list">
      <div className="tl-header">
        <h3>Top Locations</h3>
        <span className="tl-count">{topLocations.length}</span>
      </div>

      <div className="tl-items">
        {topLocations.length === 0 && (
          <div className="tl-empty">No location data</div>
        )}
        {topLocations.map((loc, i) => (
          <button
            key={loc.name}
            className={`tl-item ${selectedLocation === loc.name ? 'selected' : ''}`}
            onClick={() =>
              setSelectedLocation(selectedLocation === loc.name ? null : loc.name)
            }
          >
            <span className="tl-rank" style={{ background: activeChannel.color }}>
              {i + 1}
            </span>
            <span className="tl-name">{loc.name}</span>
            <span className="tl-bar-wrap">
              <span
                className="tl-bar"
                style={{
                  width: `${(loc.count / (topLocations[0]?.count || 1)) * 100}%`,
                  background: activeChannel.color,
                }}
              />
            </span>
            <span className="tl-val">{loc.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
