/**
 * Trend chart – SVG sparkline showing article volume over time.
 * Data comes from GDELT DOC 2.0 API (TimelineVol mode).
 */

import { useStore } from '../store';
import './TrendChart.css';

export function TrendChart() {
  const timelineData = useStore((s) => s.timelineData);
  const activeChannel = useStore((s) => s.activeChannel);

  if (timelineData.length === 0) {
    return <div className="trend-chart empty">Waiting for timeline data…</div>;
  }

  const height = 120;
  const pad = 16;
  const values = timelineData.map((d) => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;

  const pts = timelineData.map((d, i) => {
    const x = pad + (i / (timelineData.length - 1)) * (100 - 2 * pad);
    const y = height - pad - ((d.value - minVal) / range) * (height - 2 * pad);
    return `${x},${y}`;
  });

  const line = `M ${pts.join(' L ')}`;
  const area = `${line} L ${100 - pad},${height - pad} L ${pad},${height - pad} Z`;

  const first = timelineData[0].date;
  const last = timelineData[timelineData.length - 1].date;

  return (
    <div className="trend-chart">
      <div className="tc-header">
        <h3>Volume Trend</h3>
        <span className="tc-peak" style={{ color: activeChannel.color }}>
          peak {maxVal}
        </span>
      </div>

      <svg className="tc-svg" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="tc-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={activeChannel.color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={activeChannel.color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#tc-grad)" />
        <path d={line} fill="none" stroke={activeChannel.color} strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="tc-labels">
        <span>{first}</span>
        <span>{last}</span>
      </div>
    </div>
  );
}
