
export abstract class Logger {
  public abstract debug(message: string): void;
  public abstract info(message: string): void;
  public abstract warn(message: string): void;
  public abstract error(message: string): void;
  public abstract fatal(message: string): void;
  public abstract trace(message: string): void;
}
