/**
 * Channel selector – horizontal chip list for choosing a news topic.
 * Clicking a chip sets the active channel in the global store.
 */

import { useStore } from '../store';
import { CHANNELS } from '../data/channels';
import './ChannelSelector.css';

export function ChannelSelector() {
  const activeChannel = useStore((s) => s.activeChannel);
  const setActiveChannel = useStore((s) => s.setActiveChannel);

  return (
    <div className="channel-selector">
      {CHANNELS.map((ch) => (
        <button
          key={ch.id}
          className={`channel-chip ${activeChannel.id === ch.id ? 'active' : ''}`}
          style={
            activeChannel.id === ch.id
              ? { background: ch.color, borderColor: ch.color }
              : undefined
          }
          onClick={() => setActiveChannel(ch)}
          title={ch.description}
        >
          <span className="channel-icon">{ch.icon}</span>
          <span className="channel-label">{ch.label}</span>
        </button>
      ))}
    </div>
  );
}
