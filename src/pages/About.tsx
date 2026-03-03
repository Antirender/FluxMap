/**
 * About / Methods page – transparency about data, tech, and limitations.
 */

import './About.css';

export function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* hero */}
        <header className="about-hero">
          <h1>About FluxMap</h1>
          <p className="about-subtitle">
            An open, real-time news event radar with multi-source resilience
          </p>
        </header>

        {/* what */}
        <section className="about-section">
          <h2>What is FluxMap?</h2>
          <p>
            FluxMap transforms the global firehose of online news into a living,
            interactive heatmap. It pulls articles from multiple news APIs,
            extracts geographic mentions, and renders the result on a
            deck.gl / MapLibre globe — giving you an at-a-glance picture
            of where news is happening <em>right now</em>.
          </p>
        </section>

        {/* data */}
        <section className="about-section">
          <h2>Data Sources — Multi-Source Provider Chain</h2>
          <p>
            FluxMap uses a <strong>5-layer fallback chain</strong> to ensure
            data is always available, even when individual APIs go down:
          </p>
          <div className="about-api-grid">
            <div className="about-api-card">
              <h3>1. NewsData.io</h3>
              <code>newsdata.io/api/1/latest</code>
              <p>
                Primary live source. Free tier with 200 credits/day.
                Returns latest news articles with country tags, which
                FluxMap geocodes via a built-in city/country dictionary.
              </p>
            </div>
            <div className="about-api-card">
              <h3>2. The Guardian</h3>
              <code>content.guardianapis.com/search</code>
              <p>
                Second live source via the Guardian Open Platform.
                Free API key with generous rate limits. Articles are
                geocoded from headline text using location extraction.
              </p>
            </div>
            <div className="about-api-card">
              <h3>3. GDELT Project</h3>
              <code>api.gdeltproject.org/api/v2</code>
              <p>
                Geo-native news monitoring across 100+ languages.
                Returns GeoJSON points directly. Used when available
                but currently intermittent.
              </p>
            </div>
            <div className="about-api-card">
              <h3>4–5. Cache &amp; Demo</h3>
              <p>
                localStorage cache (30-min TTL) stores the last
                successful result per channel. If all APIs fail,
                curated demo data with real article links is shown.
              </p>
            </div>
          </div>
        </section>

        {/* channels */}
        <section className="about-section">
          <h2>Channels</h2>
          <p>
            FluxMap ships with <strong>8 pre-defined topic channels</strong> — Protest,
            Wildfire, Earthquake, Flood, Cyber, Health, Economy, Elections — each
            mapped to a GDELT Boolean query. An "All" channel performs a broad
            global scan. Users can also type free-text keywords to build custom
            queries.
          </p>
        </section>

        {/* refresh */}
        <section className="about-section">
          <h2>Refresh Cycle &amp; Caching</h2>
          <ul className="about-list">
            <li>
              <strong>Auto-refresh</strong> — the Explore dashboard re-fetches
              data every <strong>60 seconds</strong>.
            </li>
            <li>
              <strong>Serverless proxies</strong> — API keys are stored
              server-side in Vercel Serverless Functions. The browser
              never sees them.
            </li>
            <li>
              <strong>Edge CDN cache</strong> — API responses are cached at
              Vercel's Edge with <code>s-maxage=300</code> and
              <code>stale-while-revalidate=600</code>.
            </li>
            <li>
              <strong>localStorage cache</strong> — the browser stores the
              last successful result per channel + time window with a
              30-minute TTL.
            </li>
            <li>
              <strong>Story page</strong> — uses pre-built static data
              (bundled at build time). Zero API dependency.
            </li>
          </ul>
        </section>

        {/* tech */}
        <section className="about-section">
          <h2>Technology Stack</h2>
          <div className="about-tech-grid">
            {[
              ['Frontend', 'React 19 · TypeScript 5 · Vite'],
              ['Mapping', 'deck.gl 9 · MapLibre GL 5'],
              ['State', 'Zustand'],
              ['Routing', 'React Router 7'],
              ['Scrollytelling', 'react-scrollama'],
              ['Hosting', 'Vercel (Edge CDN + Serverless Functions)'],
              ['Styling', 'Plain CSS + Custom Properties (dark / light)'],
            ].map(([label, value]) => (
              <div className="about-tech-row" key={label}>
                <span className="about-tech-label">{label}</span>
                <span className="about-tech-value">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* limitations */}
        <section className="about-section">
          <h2>Limitations &amp; Caveats</h2>
          <ul className="about-list">
            <li>
              <strong>Geocoding accuracy</strong> — for non-GDELT sources,
              locations are extracted from article titles and country tags
              using a built-in dictionary. Some points may be approximate.
            </li>
            <li>
              <strong>Coverage bias</strong> — English-language and Western
              media are over-represented across all data sources.
            </li>
            <li>
              <strong>Volume ≠ importance</strong> — a high article count does
              not necessarily mean the event is more significant.
            </li>
            <li>
              <strong>Rate limits</strong> — NewsData.io free tier allows
              200 credits/day. The Guardian is more generous but may
              throttle under heavy usage.
            </li>
            <li>
              <strong>Demo data</strong> — when all APIs are unreachable,
              demo articles use real but older news links (2023–2024).
            </li>
          </ul>
        </section>

        <footer className="about-footer">
          <p>© 2026 FluxMap · Built for VDES 39915 at Sheridan College</p>
        </footer>
      </div>
    </div>
  );
}
