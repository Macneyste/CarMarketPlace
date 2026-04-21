import { useEffect } from 'react';

function Toast({ open, tone = 'success', message, onClose }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, 2800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [open, onClose]);

  if (!open || !message) {
    return null;
  }

  const toastLabel = tone === 'error' ? 'Error' : 'Success';

  return (
    <div className={`toast toast-${tone}`} role="status" aria-live="polite">
      <div className="toast-copy">
        <span className="toast-label">{toastLabel}</span>
        <p>{message}</p>
      </div>

      <button type="button" className="toast-close" onClick={onClose} aria-label="Close toast">
        x
      </button>
    </div>
  );
}

export default Toast;
