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
            An open, real-time news event radar powered by GDELT
          </p>
        </header>

        {/* what */}
        <section className="about-section">
          <h2>What is FluxMap?</h2>
          <p>
            FluxMap transforms the global firehose of online news into a living,
            interactive heatmap. It pulls geo-tagged media mentions from the
            GDELT Project in near-real-time, clusters them by location and
            topic, and renders the result on a deck.gl / MapLibre globe — giving
            you an at-a-glance picture of where news is happening <em>right now</em>.
          </p>
        </section>

        {/* data */}
        <section className="about-section">
          <h2>Data Source — GDELT</h2>
          <p>
            The <a href="https://www.gdeltproject.org/" target="_blank" rel="noopener noreferrer">GDELT Project</a> monitors
            broadcast, print and web news from nearly every country in over 100
            languages. FluxMap queries two of its public APIs:
          </p>
          <div className="about-api-grid">
            <div className="about-api-card">
              <h3>GEO 2.0 API</h3>
              <code>api.gdeltproject.org/api/v2/geo/geo</code>
              <p>
                Returns geo-coded point data in GeoJSON format. Each point
                represents a location mentioned in matching articles, with a
                <strong> count</strong> of how many articles reference it.
              </p>
            </div>
            <div className="about-api-card">
              <h3>DOC 2.0 API</h3>
              <code>api.gdeltproject.org/api/v2/doc/doc</code>
              <p>
                Returns article metadata (<em>ArtList</em> mode) and volume
                timelines (<em>TimelineVol</em> mode) for the matching query
                and time window.
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
              <strong>Edge CDN cache</strong> — API responses are cached at
              Vercel's Edge with <code>s-maxage=60</code> and
              <code>stale-while-revalidate=300</code>, so channel switches are
              nearly instant for popular queries.
            </li>
            <li>
              <strong>Client LRU cache</strong> — the browser keeps up to 80
              query results in memory with a 60-second TTL, keyed by
              <code>endpoint:query:timespan</code>. Switching channels no longer
              clears the cache — each combination is kept independently and
              evicted by LRU.
            </li>
            <li>
              <strong>GDELT cadence</strong> — GDELT itself updates roughly
              every 15 minutes, so identical queries may return the same data
              within that interval.
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
              <strong>Geocoding accuracy</strong> — GDELT assigns locations via
              NLP; some points may be mis-placed or refer to a country centroid
              rather than a precise city.
            </li>
            <li>
              <strong>Coverage bias</strong> — English-language and Western
              media are over-represented in the dataset.
            </li>
            <li>
              <strong>Volume ≠ importance</strong> — a high article count does
              not necessarily mean the event is more significant.
            </li>
            <li>
              <strong>Rate limits</strong> — GDELT APIs are free but may
              throttle under heavy usage.
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
