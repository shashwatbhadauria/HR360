import { useState, useEffect } from 'react';

/**
 * Debounce a value by the given delay (ms).
 * Useful for search inputs to avoid firing on every keystroke.
 * @param {*} value - The value to debounce
 * @param {number} [delay=300] - Debounce delay in milliseconds
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
