/**
 * Non-intrusive toast notification stack.
 * Shows transient error / info messages that auto-dismiss.
 */

import { useStore } from '../store';
import './ErrorToast.css';

export function ErrorToast() {
  const errors = useStore((s) => s.errors);
  const dismissError = useStore((s) => s.dismissError);

  if (errors.length === 0) return null;

  return (
    <div className="error-toast-stack" role="alert" aria-live="polite">
      {errors.map((e) => (
        <div key={e.id} className="error-toast">
          <span className="et-icon">⚠</span>
          <span className="et-msg">{e.message}</span>
          <button
            className="et-close"
            onClick={() => dismissError(e.id)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
