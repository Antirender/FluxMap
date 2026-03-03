/**
 * Top-level layout: compact navbar + routed content area.
 * Includes theme toggle and mobile hamburger menu.
 */

import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LoadingOverlay } from './LoadingOverlay';
import { ErrorToast } from './ErrorToast';
import { useStore } from '../store';
import './Layout.css';

const NAV_LINKS = [
  { to: '/', label: 'Story' },
  { to: '/explore', label: 'Explore' },
  { to: '/about', label: 'About' },
];

export function Layout() {
  const { pathname } = useLocation();
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  /* sync data-theme attribute on mount & change */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* close mobile menu on navigation */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="layout">
      <LoadingOverlay />
      <ErrorToast />

      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">⚡ FluxMap</Link>
          <span className="navbar-tagline">Real-time News Radar</span>
        </div>

        <div className="navbar-right">
          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`nav-link ${pathname === l.to ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
