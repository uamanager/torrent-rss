/**
 * Base class for all feed items
 * @class FeedItem
 */
export class FeedItem {
  constructor(title, description, date, guid) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.guid = guid;
  }
}