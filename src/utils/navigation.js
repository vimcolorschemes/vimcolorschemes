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
