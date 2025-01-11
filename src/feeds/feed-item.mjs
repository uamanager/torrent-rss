import { URL } from 'node:url';

/**
 * Base class for all feed items
 * @class FeedItem
 */
export class FeedItem {
  /**
   * Initialize feed item
   * @param {string} title Title
   * @param {string} description Description
   * @param {number} size Size
   * @param {number} seeders Seeders
   * @param {number} peers Peers
   * @param {Date} date Date
   * @param {URL} detailsUrl Details URL
   * @param {URL} downloadUrl Download URL
   */
  constructor(
    title,
    description,
    size,
    seeders,
    peers,
    date,
    detailsUrl,
    downloadUrl,
  ) {
    this.title = title;
    this.description = description;
    this.size = size;
    this.seeders = seeders;
    this.peers = peers;
    this.date = date.toISOString();
    this.detailsUrl = detailsUrl.toString();
    this.downloadUrl = downloadUrl.toString();
  }
}