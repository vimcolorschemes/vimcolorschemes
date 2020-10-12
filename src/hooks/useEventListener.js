import { useEffect } from "react";

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
