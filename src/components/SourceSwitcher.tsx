/**
 * SourceSwitcher — lets the user manually pin a preferred news data source.
 *
 * Shown in the Explore toolbar as a pill/button. Clicking opens a small
 * popover with 5 options. The preference is persisted to localStorage so
 * it survives page reloads.
 *
 *  Auto (default)  — tries NewsData.io → Guardian → GDELT → cache → demo
 *  NewsData.io     — tries NewsData.io first, falls back if down
 *  Guardian        — tries Guardian first, falls back if down
 *  GDELT           — tries GDELT first, falls back if down
 *  Demo / Offline  — serves static demo data immediately
 */

import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import './SourceSwitcher.css';

interface SourceOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

const OPTIONS: SourceOption[] = [
  {
    id: 'auto',
    label: 'Auto',
    icon: '🔄',
    description: 'NewsData.io → Guardian → GDELT → cache → demo',
  },
  {
    id: 'newsdata',
    label: 'NewsData.io',
    icon: '📡',
    description: 'Live global news — primary live source',
  },
  {
    id: 'guardian',
    label: 'The Guardian',
    icon: '📰',
    description: 'Full-text search across Guardian content',
  },
  {
    id: 'gdelt',
    label: 'GDELT',
    icon: '🌐',
    description: 'Geo-coded media mentions (may be slow)',
  },
  {
    id: 'demo',
    label: 'Demo / Offline',
    icon: '📦',
    description: 'Static curated articles — no network needed',
  },
];

const SOURCE_LABELS: Record<string, string> = {
  auto: 'Auto',
  newsdata: 'NewsData.io',
  guardian: 'Guardian',
  gdelt: 'GDELT',
  demo: 'Demo',
  cache: 'Cache',
};

export function SourceSwitcher({ onTourRequest }: { onTourRequest?: () => void }) {
  const preferredSource = useStore((s) => s.preferredSource);
  const setPreferredSource = useStore((s) => s.setPreferredSource);
  const dataSource = useStore((s) => s.dataSource);
  const refreshData = useStore((s) => s.refreshData);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (id: string) => {
    setPreferredSource(id);
    setOpen(false);
    // Re-fetch with the new preference
    setTimeout(() => refreshData(), 50);
  };

  const current = OPTIONS.find((o) => o.id === preferredSource) ?? OPTIONS[0];
  /* also show the actual live source if different from preference */
  const liveLabel = dataSource ? SOURCE_LABELS[dataSource] : null;

  return (
    <div className="ss-root" ref={ref}>
      <button
        className={`ss-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        title="Data source settings"
      >
        <span className="ss-icon">⚙</span>
        <span className="ss-label">
          {current.id === 'auto' && liveLabel
            ? `Source: ${liveLabel}`
            : `Source: ${current.label}`}
        </span>
        <span className="ss-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="ss-popover">
          <div className="ss-popover-header">
            <span>Data Source</span>
            <span className="ss-popover-hint">Select preferred provider</span>
          </div>

          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={`ss-option ${preferredSource === opt.id ? 'selected' : ''}`}
              onClick={() => select(opt.id)}
            >
              <span className="ss-opt-icon">{opt.icon}</span>
              <span className="ss-opt-body">
                <span className="ss-opt-label">{opt.label}</span>
                <span className="ss-opt-desc">{opt.description}</span>
              </span>
              {preferredSource === opt.id && <span className="ss-check">✓</span>}
            </button>
          ))}

          {onTourRequest && (
            <button className="ss-tour-btn" onClick={() => { setOpen(false); onTourRequest(); }}>
              🧭 Show onboarding tour
            </button>
          )}
        </div>
      )}
    </div>
  );
}
