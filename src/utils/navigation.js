// source: https://gomakethings.com/how-to-test-if-an-element-is-in-the-viewport-with-vanilla-javascript/
export const isInViewport = element => {
  const bounding = element.getBoundingClientRect();
  const clientHeight =
    window?.innerHeight || document?.documentElement.clientHeight;
  const clientWidth =
    window?.innerWidth || document?.documentElement.clientWidth;
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= clientHeight &&
    bounding.right <= clientWidth
  );
};

export const isAtPageTop = () => {
  if (typeof window === "undefined") return true;

  const scrollTop =
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;

  return scrollTop === 0;
};

export const isBrowserActive = () =>
  typeof window !== "undefined" && typeof document !== "undefined";
