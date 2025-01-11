/**
 * Base class for all feeds
 * @abstract
 * @class BaseFeed
 */
export class BaseFeed {
  static type = 'base';

  /**
   * Get feed data
   * @param {Record<string, any>} query Query parameters
   * @returns {Promise<FeedDetails>}
   */
  async execute(query) {
    throw new Error('Not implemented');
  }
}