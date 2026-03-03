/**
 * Segmented control for switching the GDELT query time window.
 * Shows a loading pulse on the active segment and warns for heavy windows.
 */

import { useStore } from '../store';
import type { TimeWindow } from '../types';
import './TimeWindowSwitcher.css';

const TIME_WINDOWS: { value: TimeWindow; label: string; hint: string }[] = [
  { value: '15m', label: '15 min', hint: 'Last 15 minutes' },
  { value: '1h',  label: '1 hr',   hint: 'Last hour' },
  { value: '6h',  label: '6 hr',   hint: 'Last 6 hours' },
  { value: '24h', label: '24 hr',  hint: 'Last 24 hours' },
  { value: '7d',  label: '7 day',  hint: '7 days — larger dataset, may be slower' },
];

export function TimeWindowSwitcher() {
  const { timeWindow, setTimeWindow, isLoading } = useStore();

  return (
    <div className="time-window-switcher" role="radiogroup" aria-label="Time window">
      {TIME_WINDOWS.map((tw) => (
        <button
          key={tw.value}
          role="radio"
          aria-checked={timeWindow === tw.value}
          className={`tw-btn ${timeWindow === tw.value ? 'active' : ''} ${
            timeWindow === tw.value && isLoading ? 'loading' : ''
          }`}
          onClick={() => setTimeWindow(tw.value)}
          title={tw.hint}
          disabled={timeWindow === tw.value && isLoading}
        >
          {tw.label}
        </button>
      ))}
    </div>
  );
}
