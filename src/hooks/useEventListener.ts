import { useEffect } from 'react';

/**
 * Hook to add any event listener to the document.
 *
 * @example
 * useEventListener("mousemove", () => console.log("mouse has moved"));
 *
 * @param event The name of the event to listen to
 * @param callback Callback function when event has happened
 */
function useEventListener<EventType extends Event>(
  event: string,
  callback: (event: EventType) => void,
) {
  useEffect(() => {
    if (
      !event ||
      !callback ||
      typeof window === 'undefined' ||
      typeof document === 'undefined'
    ) {
      return;
    }

    const eventListener = (event: Event) => callback(event as EventType);

    document.addEventListener(event, eventListener);
    return () => document.removeEventListener(event, eventListener);
  }, [event, callback]);
}

export default useEventListener;
