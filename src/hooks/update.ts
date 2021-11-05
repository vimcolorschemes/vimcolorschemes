import { useState } from 'react';

/**
 * Hook to force a component to rerender
 *
 * @returns {() => void} The callback function to force update a component
 */
function useForceUpdate(): () => void {
  const [_value, setValue] = useState<number>(0);
  return () => setValue(value => value + 1);
}

export default useForceUpdate;
