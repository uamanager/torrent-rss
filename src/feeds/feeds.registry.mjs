import { Logger } from '../common/logger.mjs';

/**
 * Feeds registry
 * @class FeedsRegistry
 */
export class FeedsRegistry {
  $_logger = new Logger(this.constructor.name);
  /**
   * Register for feeds
   * @type {Map<string, BaseFeed>}
   * @private
   */
  _feeds = new Map();

  /**
   * Register feed
   * @param {string} type Feed type
   * @param {BaseFeed} feed Feed instance
   */
  register(type, feed) {
    this.$_logger.info('Registering feed:', {
      type,
    });
    this._feeds.set(type, feed);

    this.$_logger.info('Feed registered:', {
      type,
    });
  }

  /**
   * Get feed
   * @param {string} type Feed type
   * @returns {BaseFeed}
   */
  get(type) {
    this.$_logger.info('Getting feed:', {
      type,
    });

    const _feed = this._feeds.get(type);

    if (!_feed) {
      const _error = new Error(`Feed '${type}' not found`);
      this.$_logger.error(_error);
      throw _error;
    }

    this.$_logger.info('Feed found:', {
      type,
    });

    return _feed;
  }
}

/**
 * Feeds registry instance
 * @type {FeedsRegistry}
 */
export const Feeds = new FeedsRegistry();