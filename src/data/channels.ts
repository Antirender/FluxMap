/**
 * Channel definitions for GDELT news topic filtering
 *
 * Each channel maps to a GDELT query string. The queries use
 * Boolean operators supported by GDELT's full-text search.
 * Reference: https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/
 */

export interface Channel {
  id: string;
  label: string;
  query: string;
  icon: string;
  color: string;
  description: string;
}

export const CHANNELS: Channel[] = [
  {
    id: 'all',
    label: 'All News',
    query: 'sourcelang:english',
    icon: '🌍',
    color: '#0ea5e9',
    description: 'All global news coverage',
  },
  {
    id: 'protest',
    label: 'Protest',
    query: '("protest" OR "riot" OR "demonstration" OR "unrest")',
    icon: '✊',
    color: '#ef4444',
    description: 'Protests, riots, and civil unrest worldwide',
  },
  {
    id: 'wildfire',
    label: 'Wildfire',
    query: '("wildfire" OR "forest fire" OR "bushfire")',
    icon: '🔥',
    color: '#f97316',
    description: 'Wildfires and forest fires globally',
  },
  {
    id: 'earthquake',
    label: 'Earthquake',
    query: '("earthquake" OR "aftershock" OR "seismic")',
    icon: '🌋',
    color: '#a855f7',
    description: 'Earthquakes and seismic activity',
  },
  {
    id: 'flood',
    label: 'Flood',
    query: '("flood" OR "flooding" OR "flash flood" OR "storm surge")',
    icon: '🌊',
    color: '#3b82f6',
    description: 'Floods and water-related disasters',
  },
  {
    id: 'cyber',
    label: 'Cyber',
    query: '("cyberattack" OR "ransomware" OR "data breach" OR "hacking")',
    icon: '💻',
    color: '#22c55e',
    description: 'Cyber attacks, ransomware, and data breaches',
  },
  {
    id: 'health',
    label: 'Health',
    query: '("outbreak" OR "epidemic" OR "pandemic" OR "public health")',
    icon: '🏥',
    color: '#14b8a6',
    description: 'Disease outbreaks and public health emergencies',
  },
  {
    id: 'economy',
    label: 'Economy',
    query: '("inflation" OR "recession" OR "unemployment" OR "economic crisis")',
    icon: '📈',
    color: '#eab308',
    description: 'Economic indicators and financial crises',
  },
  {
    id: 'elections',
    label: 'Elections',
    query: '("election" OR "voting" OR "polling station" OR "ballot")',
    icon: '🗳️',
    color: '#6366f1',
    description: 'Elections and democratic processes',
  },
];

/** Look up a channel by ID, fallback to 'all' */
export function getChannel(id: string): Channel {
  return CHANNELS.find((c) => c.id === id) ?? CHANNELS[0];
}
