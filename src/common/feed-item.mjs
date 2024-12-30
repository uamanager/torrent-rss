import { URL } from 'node:url';

/**
 * Base class for all feed items
 * @class FeedItem
 */
export class FeedItem {
  constructor(
    title,
    size,
    seeders,
    peers,
    date,
    downloadUrl,
    detailsUrl,
  ) {
    this.title = `(${seeders}/${peers}) ${title}`;
    this.description = `(${seeders}/${peers}) ${title}`;
    this.date = date.toISOString();
    this.downloadUrl = new URL(downloadUrl).toString();
    this.detailsUrl = new URL(detailsUrl).toString();
    this.size = size;
  }
}