/**
 * Segmented control for switching the GDELT query time window.
 * GDELT supports minute-level resolution (min 15 min).
 * Reference: https://blog.gdeltproject.org/gdelt-2-0-our-global-world-in-realtime/
 */

import { useStore } from '../store';
import type { TimeWindow } from '../types';
import './TimeWindowSwitcher.css';

const TIME_WINDOWS: { value: TimeWindow; label: string }[] = [
  { value: '15m', label: '15 min' },
  { value: '1h',  label: '1 hr'  },
  { value: '6h',  label: '6 hr'  },
  { value: '24h', label: '24 hr' },
  { value: '7d',  label: '7 day' },
];

export function TimeWindowSwitcher() {
  const { timeWindow, setTimeWindow } = useStore();

  return (
    <div className="time-window-switcher">
      {TIME_WINDOWS.map((tw) => (
        <button
          key={tw.value}
          className={`tw-btn ${timeWindow === tw.value ? 'active' : ''}`}
          onClick={() => setTimeWindow(tw.value)}
        >
          {tw.label}
        </button>
      ))}
    </div>
  );
}
