export class Logger {
  private readonly isDevelopment: boolean =
    process.env.NODE_ENV === "development";

  public error(message: string): void {
    console.error(message);
  }

  public warn(message: string): void {
    console.warn(message);
  }

  public info(message: string): void {
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(message);
    }
  }
}
