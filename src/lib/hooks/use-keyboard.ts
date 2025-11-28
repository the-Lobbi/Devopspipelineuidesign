
import { useEffect } from 'react';

export function useKeyboard(key: string, callback: (e: KeyboardEvent) => void, meta = false) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key && (!meta || (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        callback(e);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [key, callback, meta]);
}
