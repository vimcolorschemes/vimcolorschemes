import { useState, useEffect } from "react";

/**
 * Hook to debounce a value
 *
 * @param {*} value The value to debounce
 * @param {number} [delay=200] The delay between the true value and debounced value
 */
export const useDebounce = (value, delay = 200) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
