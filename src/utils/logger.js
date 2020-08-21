const COLORS = {
  DEFAULT: "\x1b[0m",
  BLUE: "\x1b[34m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  RED: "\x1b[31m",
};

const Logger = {
  info: message =>
    console.log(`${COLORS.BLUE}info ${COLORS.DEFAULT}${message}`),

  success: message =>
    console.log(`${COLORS.GREEN}success ${COLORS.DEFAULT}${message}`),

  error: message =>
    console.log(`${COLORS.RED}error ${COLORS.DEFAULT}${message}`),
};

export default Logger;
