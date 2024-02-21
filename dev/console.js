// Monkey patch console to use Cresta logger when defined
var consoleLogFns = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

console.log = function () {
  if (window.cresta && window.cresta.logger) {
    window.cresta.logger.info.apply(window.cresta.logger, arguments);
  } else {
    consoleLogFns.log.apply(console, arguments);
  }
};

console.info = function () {
  if (window.cresta && window.cresta.logger) {
    window.cresta.logger.info.apply(window.cresta.logger, arguments);
  } else {
    consoleLogFns.info.apply(console, arguments);
  }
};

console.warn = function () {
  if (window.cresta && window.cresta.logger) {
    window.cresta.logger.warn.apply(window.cresta.logger, arguments);
  } else {
    consoleLogFns.warn.apply(console, arguments);
  }
};

console.error = function () {
  if (window.cresta && window.cresta.logger) {
    window.cresta.logger.error.apply(window.cresta.logger, arguments);
    consoleLogFns.error.apply(console, arguments);
  }
};

console.debug = function () {
  if (window.cresta && window.cresta.logger) {
    window.cresta.logger.verbose.apply(window.cresta.logger, arguments);
  } else {
    consoleLogFns.debug.apply(console, arguments);
  }
};
