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
    url
  ) {
    this.title = title;
    this.description = `[${seeders}/${peers}] ${title}`;
    this.date = date.toISOString();
    this.url = url;
    this.size = size;
  }
}