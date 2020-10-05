import { useEffect } from "react";

import { MOUSE_EVENTS, KEYS, NON_NAVIGATION_KEYS } from "src/constants";

export const useNavigationEffect = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const eventListener = event =>
        Object.values(KEYS).includes(event.key) &&
        !NON_NAVIGATION_KEYS.includes(event.key) &&
        togglePointerEvents(MOUSE_EVENTS.KEY_PRESS);

      window.addEventListener("keydown", eventListener);
      return () => window.removeEventListener("keydown", eventListener);
    }
  }, []);
};

/**
 * Listener should be triggered once and then cleared itself
 * It sets _document.body.style.pointerEvents_ to '' if it
 * has changed it's value
 */
const mouseMoveListener = () =>
  togglePointerEvents(MOUSE_EVENTS.MOUSE_MOVE) &&
  window.removeEventListener("mousemove", mouseMoveListener);

/**
 * This function set _document.body.style.pointerEvents_ to 'none'
 * when user starts to use the keyboard to navigate and set an
 * event listener for in case of a mouse movement.
 *
 * @param {string} eventName name of the events that should be
 * change the behaviour of mouse effects on the page
 */
const togglePointerEvents = eventName => {
  const actions = {
    [MOUSE_EVENTS.KEY_PRESS]: pointerEvents => {
      if (pointerEvents === MOUSE_EVENTS.NONE) return;

      document.body.style.pointerEvents = MOUSE_EVENTS.NONE;
      window.addEventListener("mousemove", mouseMoveListener);
    },
    [MOUSE_EVENTS.MOUSE_MOVE]: pointerEvents => {
      if (pointerEvents === MOUSE_EVENTS.CLEAR) return;

      document.body.style.pointerEvents = MOUSE_EVENTS.CLEAR;
    },
  };

  actions[eventName](document.body.style.pointerEvents);
};