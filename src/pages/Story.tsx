/**
 * Story page – Scrollama-driven scrollytelling narrative.
 * Each step drives the shared store (channel, time window)
 * so the fixed-background MapView reacts in real time.
 */

import { useState, useEffect, useCallback } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import { Link } from 'react-router-dom';
import { MapView } from '../components/MapView';
import { useStore } from '../store';
import { CHANNELS } from '../data/channels';
import type { TimeWindow } from '../types';
import './Story.css';

/* ── narrative steps ── */
interface NarrativeStep {
  id: number;
  title: string;
  body: string;
  tip?: string;
  channelId?: string;
  window?: TimeWindow;
}

const STEPS: NarrativeStep[] = [
  {
    id: 1,
    title: 'Welcome to FluxMap',
    body: 'A real-time news radar that transforms the global firehose of media into a living, breathing map. Scroll down to begin the journey.',
    tip: '💡 The map behind this card is live — it updates from GDELT every 60 seconds.',
    channelId: 'all',
    window: '24h',
  },
  {
    id: 2,
    title: 'The Global Pulse',
    body: 'Every minute, thousands of news stories are published worldwide. The heatmap shows where media attention is concentrated right now — brighter regions mean more coverage.',
    tip: '🔥 Brighter areas = more articles. The dots represent individual geo-tagged locations.',
    channelId: 'all',
    window: '24h',
  },
  {
    id: 3,
    title: 'Voices of Dissent',
    body: 'Switching to the Protest channel reveals demonstrations, strikes, and civil unrest across the globe. Red dots mark locations with active coverage.',
    tip: '✊ Channel queries use Boolean search — e.g. "protest" OR "riot" OR "demonstration".',
    channelId: 'protest',
    window: '24h',
  },
  {
    id: 4,
    title: 'Forces of Nature',
    body: 'Wildfires, earthquakes, floods — natural hazards generate rapid bursts of media attention. Watch how disaster coverage clusters geographically.',
    tip: '🌍 GDELT geo-codes locations from article text — some dots may be country-level centroids.',
    channelId: 'wildfire',
    window: '24h',
  },
  {
    id: 5,
    title: 'Time Reveals Patterns',
    body: 'Narrowing the window to just one hour shows only the freshest stories. Compare this to the 24-hour view and see how quickly the news cycle evolves.',
    tip: '⏱ Time windows: 15 min → 7 days. Shorter windows show breaking events; longer windows reveal trends.',
    channelId: 'all',
    window: '1h',
  },
  {
    id: 6,
    title: 'Digital Frontiers',
    body: 'Cyber-attacks and data breaches are invisible yet deeply impactful. This channel tracks the digital threat landscape in near-real-time.',
    tip: '💻 Cyber events often cluster in capital cities because GDELT uses HQ locations.',
    channelId: 'cyber',
    window: '6h',
  },
  {
    id: 7,
    title: 'Your Turn',
    body: "You've seen how FluxMap works. Head to the Explore dashboard to choose your own channels, search keywords, and dive into the articles behind every dot.",
    tip: '🧭 Use the ⚙ layer controls on the Explore map to toggle heatmap, change colours, and adjust intensity.',
    channelId: 'all',
    window: '24h',
  },
];

export function Story() {
  const [currentStep, setCurrentStep] = useState(0);
  const setActiveChannel = useStore((s) => s.setActiveChannel);
  const setTimeWindow = useStore((s) => s.setTimeWindow);
  const refreshData = useStore((s) => s.refreshData);

  /* apply step side-effects */
  const applyStep = useCallback(
    (step: NarrativeStep) => {
      if (step.channelId) {
        const ch = CHANNELS.find((c) => c.id === step.channelId) ?? CHANNELS[0];
        setActiveChannel(ch);
      }
      if (step.window) {
        setTimeWindow(step.window);
      }
      refreshData();
    },
    [setActiveChannel, setTimeWindow, refreshData],
  );

  /* kick off first step */
  useEffect(() => {
    applyStep(STEPS[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStepEnter = ({ data }: { data: number }) => {
    setCurrentStep(data);
    const step = STEPS.find((s) => s.id === data);
    if (step) applyStep(step);
  };

  return (
    <div className="story-page">
      {/* fixed map */}
      <div className="story-map-bg">
        <MapView />
        <div className="story-map-dim" />
      </div>

      {/* scrollama overlay */}
      <div className="story-scroller">
        <Scrollama offset={0.45} onStepEnter={onStepEnter}>
          {STEPS.map((step) => (
            <Step data={step.id} key={step.id}>
              <div className={`story-step ${currentStep === step.id ? 'active' : ''}`}>
                <div className="story-card">
                  <span className="story-badge">
                    {step.id} / {STEPS.length}
                  </span>
                  <h2>{step.title}</h2>
                  <p>{step.body}</p>

                  {step.tip && (
                    <div className="story-tip">{step.tip}</div>
                  )}

                  {step.id === STEPS.length && (
                    <Link to="/explore" className="story-cta">
                      Open Dashboard →
                    </Link>
                  )}
                </div>
              </div>
            </Step>
          ))}
        </Scrollama>
      </div>

      {/* data source badge */}
      <div className="story-source">
        Data: GDELT Project · Updates every ~15 min
      </div>
    </div>
  );
}
