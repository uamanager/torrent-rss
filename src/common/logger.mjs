export class Logger {
  constructor(context = '') {
    this.context = context;
  }

  /**
   * Log message
   * @param {string} message Message
   * @param {any?} data Additional data
   */
  log(message, data = {}) {
    console.log(`[${this.context}]: ${message}`, data);
  }

  /**
   * Log info
   * @param {string} message Message
   * @param {any?} data Additional data
   */
  info(message, data = {}) {
    console.info(`[${this.context}]: ${message}`, data);
  }

  /**
   * Log warning
   * @param {string} message Message
   * @param {any?} data Additional data
   */
  warn(message, data = {}) {
    console.warn(`[${this.context}]: ${message}`, data);
  }

  /**
   * Log error
   * @param {Error} error Error
   * @param {any?} data Additional data
   */
  error(error, data = {}) {
    console.error(`[${this.context}]: ${error.name}: ${error.message}`, data, '\n', error.stack);
  }
}