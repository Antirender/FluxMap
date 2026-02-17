/**
 * Subtle loading overlay / pulse indicator
 */

import { useStore } from '../store';
import './LoadingOverlay.css';

export function LoadingOverlay() {
  const isLoading = useStore((s) => s.isLoading);
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-bar" />
    </div>
  );
}
