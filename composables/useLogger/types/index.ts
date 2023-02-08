/**
 * Vue Storefront Logger
 */
export interface VSFLogger {
  /**
   * Wrapper for `console.debug`.
   */
  debug(message?: any, ...args: any): void;

  /**
   * Wrapper for `console.info`.
   */
  info(message?: any, ...args: any): void;

  /**
   * Wrapper for `console.warn`.
   */
  warn(message?: any, ...args: any): void;

  /**
   * Wrapper for `console.error`.
   */
  error(message?: any, ...args: any): void;
}

/**
 * Type alias for logger implementation.
 */
export type LoggerImplementation =
  | VSFLogger
  | ((verbosity: string) => VSFLogger);

/**
 * Possible values of log names.
 */
export enum LogName {
  /**
   * Error.
   */
  Error = 'error',
  /**
   * Info.
   */
  Info = 'info',
  /**
   * Debug.
   */
  Debug = 'debug',
  /**
   * None.
   */
  None = 'none',
  /**
   * Warn.
   */
  Warn = 'warn'
}

/**
 * Type alias for log message.
 */
export type LogMessage =
  | string[]
  | Error
  | Record<string, any>
  | string
  | boolean;

/**
 * Data areturned from the {@link useLogger|useLogger()} composable
 */
export interface UseLoggerInterface {
  /**
   * Logger instance.
   */
  Logger: VSFLogger;
}
