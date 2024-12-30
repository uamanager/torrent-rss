/**
 * Base class for all feeds
 * @abstract
 * @class BaseFeed
 */
export class BaseFeed {
  static type = '';

  /**
   * Initialize feeds
   * @returns {Record<string, BaseFeed>}
   */
  static init() {
    return {};
  }

  /**
   * Get feed data
   * @param {Record<string, any>} query Query parameters
   * @returns {Promise<Array<FeedItem>>}
   */
  async fetch(query) {
    return [];
  }
}