/**
 * TourTip — five-step contextual onboarding overlay for the Explore page.
 *
 * Shown automatically on the user's first visit (flag stored in localStorage).
 * Can be re-triggered from the Source Switcher settings menu.
 *
 * Design reference: world-monitor.com NAVIGATION MODES panel
 * — numbered steps, skip/next controls, subtle backdrop.
 */

import { useState } from 'react';
import './TourTip.css';

const TOUR_SEEN_KEY = 'fluxmap_tour_seen';

interface TourStep {
  id: number;
  icon: string;
  title: string;
  body: string;
  highlight?: string;   // CSS class to add to highlighted element (future)
}

const STEPS: TourStep[] = [
  {
    id: 1,
    icon: '📺',
    title: 'Choose a Channel',
    body: 'Pick a news lens at the top: All News, Protest, Wildfire, Earthquake, Flood, or Cyber. Each channel filters the global stream to just that topic.',
    highlight: '.channel-selector',
  },
  {
    id: 2,
    icon: '⏱',
    title: 'Set the Time Window',
    body: 'Switch between 15 minutes and 7 days to control how far back you look. Short windows catch breaking events; longer ones reveal sustained trends.',
  },
  {
    id: 3,
    icon: '🗺',
    title: 'Interact with the Map',
    body: 'Each dot on the map is a geo-located article cluster. Click a dot to filter the article list to that location. Drag and scroll to explore the globe.',
  },
  {
    id: 4,
    icon: '🔍',
    title: 'Search Any Keyword',
    body: 'Type a word like "earthquake" or "election" in the search bar to drill into custom topics across all active channels.',
  },
  {
    id: 5,
    icon: '⚙',
    title: 'Switch Data Source',
    body: 'Use the Source button in the toolbar to pin a preferred provider — NewsData.io, The Guardian, GDELT, or offline Demo data. FluxMap auto-refreshes every 60 s.',
  },
];

interface TourTipProps {
  onClose: () => void;
}

export function TourTip({ onClose }: TourTipProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;

  const finish = () => {
    localStorage.setItem(TOUR_SEEN_KEY, '1');
    onClose();
  };

  return (
    <div className="tour-backdrop" onClick={finish}>
      <div className="tour-card" onClick={(e) => e.stopPropagation()}>
        {/* step counter header */}
        <div className="tour-header">
          <span className="tour-label">HOW IT WORKS</span>
          <span className="tour-counter">
            {stepIdx + 1}/{STEPS.length}
          </span>
        </div>

        {/* dot progress bar */}
        <div className="tour-dots">
          {STEPS.map((_, i) => (
            <button
              key={i}
              className={`tour-dot ${i === stepIdx ? 'active' : i < stepIdx ? 'done' : ''}`}
              onClick={() => setStepIdx(i)}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        {/* content */}
        <div className="tour-content">
          <div className="tour-step-icon">{step.icon}</div>
          <h3 className="tour-step-title">{step.title}</h3>
          <p className="tour-step-body">{step.body}</p>
        </div>

        {/* controls */}
        <div className="tour-controls">
          <button className="tour-skip" onClick={finish}>
            Skip
          </button>
          <div className="tour-nav">
            {stepIdx > 0 && (
              <button className="tour-prev" onClick={() => setStepIdx((i) => i - 1)}>
                ‹ Back
              </button>
            )}
            {isLast ? (
              <button className="tour-next tour-next--done" onClick={finish}>
                Got it ✓
              </button>
            ) : (
              <button className="tour-next" onClick={() => setStepIdx((i) => i + 1)}>
                Next ›
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Check whether the tour should be shown on first visit */
export function shouldShowTour(): boolean {
  try {
    return !localStorage.getItem(TOUR_SEEN_KEY);
  } catch {
    return false;
  }
}

/** Manually re-trigger the tour (reset seen flag) */
export function resetTour(): void {
  try {
    localStorage.removeItem(TOUR_SEEN_KEY);
  } catch { /* ignore */ }
}
