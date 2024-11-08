/**
 * Logger class for handling application logging at different levels.
 *
 * Provides methods to log error, warning, and informational messages.
 * Informational messages are only logged in the development environment.
 */
export class Logger {
  private readonly isDevelopment: boolean =
    process.env.NODE_ENV === "development";

  /**
   * Logs an error message to the console.
   * @param {string} message - The error message to log.
   */
  public error(message: string): void {
    console.error(message);
  }

  /**
   * Logs a warning message to the console.
   * @param {string} message - The warning message to log.
   */
  public warn(message: string): void {
    console.warn(message);
  }

  /**
   * Logs an informational message to the console.
   * Only logs messages if the environment is set to development.
   * @param {string} message - The informational message to log.
   */
  public info(message: string): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(message);
    }
  }
}
