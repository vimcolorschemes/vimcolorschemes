import { useState, useEffect } from 'react';

/**
 * Manages the deboucing of a value
 *
 * @param {*} value - The value to debounce
 * @param {number} [delay=500] - The delay to use when debouncing the value
 * @returns {*} The debounced value
 */
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
