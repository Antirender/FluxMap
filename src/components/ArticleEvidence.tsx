/**
 * Article list panel – shows GDELT articles.
 * When a location is selected, articles are filtered by that location's name.
 * Shows contextual empty states and loading hints.
 */

import { useMemo } from 'react';
import { useStore } from '../store';
import './ArticleEvidence.css';

export function ArticleEvidence() {
  const articles = useStore((s) => s.articles);
  const selectedLocation = useStore((s) => s.selectedLocation);
  const setSelectedLocation = useStore((s) => s.setSelectedLocation);
  const activeChannel = useStore((s) => s.activeChannel);
  const isLoading = useStore((s) => s.isLoading);

  const displayed = useMemo(() => {
    let list = articles;
    if (selectedLocation) {
      const q = selectedLocation.toLowerCase();
      list = list.filter(
        (a) =>
          (a.sourcecountry ?? '').toLowerCase().includes(q) ||
          (a.title ?? '').toLowerCase().includes(q) ||
          (a.domain ?? '').toLowerCase().includes(q),
      );
    }
    return list.slice(0, 30);
  }, [articles, selectedLocation]);

  const fmtDate = (raw: string) => {
    if (!raw) return '';
    try {
      const d = new Date(
        raw.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z'),
      );
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return raw;
    }
  };

  return (
    <div className="article-evidence">
      <div className="ae-header">
        <h3>
          {selectedLocation ? `Articles — ${selectedLocation}` : 'Latest Articles'}
        </h3>
        <div className="ae-header-actions">
          {selectedLocation && (
            <button
              className="ae-reset-btn"
              onClick={() => setSelectedLocation(null)}
              title="Back to all articles"
            >
              ↩ Overview
            </button>
          )}
          <span className="ae-count">{displayed.length}</span>
        </div>
      </div>

      <div className="ae-list">
        {displayed.length === 0 && (
          <div className="ae-empty">
            {isLoading
              ? 'Loading articles…'
              : selectedLocation
                ? `No articles match "${selectedLocation}"`
                : 'No articles found — try a different channel or time window'}
          </div>
        )}

        {displayed.map((a, i) => (
          <a
            key={`${a.url}-${i}`}
            className="ae-card"
            href={a.url_mobile || a.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ borderLeftColor: activeChannel.color }}
          >
            {a.socialimage && (
              <img
                className="ae-img"
                src={a.socialimage}
                alt=""
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="ae-body">
              <div className="ae-title">{a.title || 'Untitled'}</div>
              <div className="ae-meta">
                <span className="ae-domain">{a.domain}</span>
                {a.sourcecountry && (
                  <span className="ae-country">{a.sourcecountry}</span>
                )}
                <span className="ae-time">{fmtDate(a.seendate)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
