const winston = require("winston");

/**
 * Configures the application logger to log error messages to a file and the console.
 *
 * This logger writes JSON-formatted error messages to 'error.log' and logs
 * human-readable error messages to the console. The logging level is set to 'error'.
 */
const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    // Logs errors to a file in JSON format
    new winston.transports.File({ filename: "error.log" }),

    // Logs errors to the console in a simple format
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

module.exports = logger;
