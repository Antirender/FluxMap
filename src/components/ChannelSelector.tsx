/**
 * Channel selector – horizontal chip list for choosing a news topic.
 * Disables interaction during loading to prevent rapid-fire API calls.
 */

import { useStore } from '../store';
import { CHANNELS } from '../data/channels';
import './ChannelSelector.css';

export function ChannelSelector() {
  const activeChannel = useStore((s) => s.activeChannel);
  const setActiveChannel = useStore((s) => s.setActiveChannel);
  const isLoading = useStore((s) => s.isLoading);

  return (
    <div className="channel-selector" role="radiogroup" aria-label="News channel">
      {CHANNELS.map((ch) => (
        <button
          key={ch.id}
          role="radio"
          aria-checked={activeChannel.id === ch.id}
          className={`channel-chip ${activeChannel.id === ch.id ? 'active' : ''}`}
          style={
            activeChannel.id === ch.id
              ? { background: ch.color, borderColor: ch.color }
              : undefined
          }
          onClick={() => {
            if (activeChannel.id !== ch.id) setActiveChannel(ch);
          }}
          disabled={isLoading && activeChannel.id !== ch.id}
          title={ch.description}
        >
          <span className="channel-icon">{ch.icon}</span>
          <span className="channel-label">{ch.label}</span>
        </button>
      ))}
    </div>
  );
}
