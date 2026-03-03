/**
 * Keyword search input – optional additional filtering.
 * Debounces input so we don't spam the GDELT API.
 */

import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import './SearchInput.css';

export function SearchInput() {
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const [local, setLocal] = useState(searchQuery);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounce 600 ms
  useEffect(() => {
    timer.current = setTimeout(() => {
      if (local !== searchQuery) setSearchQuery(local);
    }, 600);
    return () => clearTimeout(timer.current);
  }, [local, searchQuery, setSearchQuery]);

  return (
    <div className="search-input-wrap">
      <span className="search-icon">🔍</span>
      <input
        id="search-keyword"
        name="search-keyword"
        className="search-input"
        type="text"
        placeholder="Add keyword…"
        aria-label="Search keyword filter"
        autoComplete="off"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />
      {local && (
        <button
          className="search-clear"
          onClick={() => { setLocal(''); setSearchQuery(''); }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
