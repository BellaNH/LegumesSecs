const isDevelopment = import.meta.env.DEV;

export const logger = {
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    console.error(...args);
  },
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};





















