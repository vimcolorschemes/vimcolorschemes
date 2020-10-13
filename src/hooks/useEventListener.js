import { useEffect } from "react";

/**
 * Hook to add any event listener to a component
 *
 * @example
 * useEventListener("mousemove", () => console.log("mouse has moved"));
 *
 * @param {string} eventName Name of the event to listen to
 * @param {function} eventListener Callback function when event has happened
 */
export const useEventListener = (eventName, eventListener) => {
  useEffect(() => {
    if (
      eventName &&
      eventListener &&
      typeof window !== "undefined" &&
      typeof document !== "undefined"
    ) {
      window.addEventListener(eventName, eventListener);
      return () => window.removeEventListener(eventName, eventListener);
    }
  }, [eventName, eventListener]);
};
