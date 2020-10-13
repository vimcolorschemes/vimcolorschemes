export const KEYS = {
  // custom navigation
  UP: "k",
  RIGHT: "l",
  DOWN: "j",
  LEFT: "h",
  ARROW_UP: "ArrowUp",
  ARROW_RIGHT: "ArrowRight",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  TOP: "g",
  BOTTOM: "G",

  // non-navigation
  ENTER: "Enter",
  ESCAPE: "Escape",
  SPACE: " ",
  TAB: "Tab",
  BACKGROUND: "b",
};

export const NON_NAVIGATION_KEYS = [
  KEYS.ENTER,
  KEYS.ESCAPE,
  KEYS.SPACE,
  KEYS.TAB,
  KEYS.BACKGROUND,
];

export const MOUSE_EVENTS = {
  NONE: "none",
  CLEAR: "",
  AUTO: "auto",

  // pointer events trigger
  MOUSE_MOVE: "mousemove",
  KEY_PRESS: "keypress",
};
