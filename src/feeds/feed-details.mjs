/**
 * Base class for feed details
 * @class FeedDetails
 */
export class FeedDetails {

  /**
   * Initialize feed details
   * @param {string} title Title
   * @param {string} description Description
   * @param {URL} feed_url Feed URL
   * @param {URL} site_url Site URL
   * @param {string} language Language
   * @param {FeedItem[]} items Items
   */
  constructor(
    title,
    description,
    feed_url,
    site_url,
    language,
    items,
  ) {
    this.title = title;
    this.description = description;
    this.feed_url = feed_url.toString();
    this.site_url = site_url.toString();
    this.language = language;
    this.items = items;
  }
}