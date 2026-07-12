import { useEffect, useEffectEvent } from 'react';

/**
 * Subscribes to a document event and forwards it to the current callback.
 *
 * @param event The document event name
 * @param callback The callback invoked when the event occurs
 */
export function useEventListener<EventType extends Event>(
  event: string,
  callback: (event: EventType) => void,
) {
  const handleEvent = useEffectEvent(callback);

  useEffect(() => {
    const eventListener = (event: Event) => handleEvent(event as EventType);

    document.addEventListener(event, eventListener);
    return () => document.removeEventListener(event, eventListener);
  }, [event]);
}

export { useEventListener as useEvent };
