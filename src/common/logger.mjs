import { pino } from 'pino';

/**
 * Logger
 * @class Logger
 */
export class Logger {
  static _logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'dd-mm-yyyy HH:MM:ss',
      },
    },
  });

  /**
   * Initialize logger
   * @param {string?} name Logger namespace
   */
  constructor(name = 'Main') {
    this.logger = Logger._logger.child({ name });
  }

  /**
   * Log info
   * @param {string} msg Message
   * @param {object?} data Additional data
   */
  info(msg, data = {}) {
    this.logger.info({ msg, ...data });
  }

  /**
   * Log warning
   * @param {string} msg Message
   * @param {object?} data Additional data
   */
  warn(msg, data = {}) {
    this.logger.warn({ msg, ...data });
  }

  /**
   * Log error
   * @param {Error} err Error
   * @param {object?} data Additional data
   */
  error(err, data = {}) {
    this.logger.error({ err, ...data });
  }
}