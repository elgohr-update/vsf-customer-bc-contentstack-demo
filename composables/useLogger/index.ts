import { VSFLogger } from '~/types';
import { LoggerImplementation, UseLoggerInterface } from './types';
import { defaultLogger } from './helpers';

/**
 * @public
 *
 * Allows using VSF logger.
 *
 * See the {@link UseLoggerInterface} for a list of methods and values available in this composable.
 */
export function useLogger(): UseLoggerInterface {
  const defaultModes = {
    // Test
    test: 'none',

    // Development
    dev: 'warn',
    development: 'warn',

    // Production
    prod: 'error',
    production: 'error',

    // Fallback
    default: 'warn'
  };

  let Logger: VSFLogger = defaultLogger;

  const registerLogger = (
    loggerImplementation: LoggerImplementation,
    verbosity: string
  ) => {
    if (typeof loggerImplementation === 'function') {
      Logger = loggerImplementation(verbosity);
      return;
    }

    switch (verbosity) {
      case 'info':
        Logger = {
          ...defaultLogger,
          ...loggerImplementation,
          debug: () => {}
        };
        break;
      case 'warn':
        Logger = {
          ...defaultLogger,
          ...loggerImplementation,
          info: () => {},
          debug: () => {}
        };
        break;
      case 'error':
        Logger = {
          ...defaultLogger,
          ...loggerImplementation,
          info: () => {},
          warn: () => {},
          debug: () => {}
        };
        break;
      case 'none':
        Logger = {
          debug: () => {},
          info: () => {},
          warn: () => {},
          error: () => {}
        };
        break;
      default:
        Logger = {
          ...defaultLogger,
          ...loggerImplementation
        };
    }
  };

  registerLogger(
    defaultLogger,
    defaultModes[process.env.NODE_ENV] || defaultModes.default
  );

  return {
    Logger
  };
}
