import { BaseFeed } from '../common/feed.mjs';
import axios from 'axios';
import { load } from 'cheerio';
import { FeedItem } from '../common/feed-item.mjs';
import { Logger } from '../common/logger.mjs';

const $_logger = new Logger('RutorFeed');

/**
 * Rutor feed
 * @class RutorFeed
 * @extends BaseFeed
 */
export class RutorFeed extends BaseFeed {
  static type = 'rutor';
  static url = 'https://rutor.info/browse';

  static _months = new Map([
    ['Янв', 0],
    ['Фев', 1],
    ['Мар', 2],
    ['Апр', 3],
    ['Май', 4],
    ['Июн', 5],
    ['Июл', 6],
    ['Авг', 7],
    ['Сен', 8],
    ['Окт', 9],
    ['Ноя', 10],
    ['Дек', 11],
  ]);

  static _categories = new Map([
    ['any', 0],
    ['movies', 1],
    ['series', 4],
    ['tvshows', 6],
    ['cartoons', 7],
    ['anime', 10],
  ]);

  static _sortBy = new Map([
    ['date-desc', 0],
    ['date-asc', 1],
    ['seeders-desc', 2],
    ['seeders-asc', 3],
    ['peers-desc', 4],
    ['peers-asc', 5],
    ['title-desc', 6],
    ['title-asc', 7],
    ['size-desc', 8],
    ['size-asc', 9],
  ]);

  static init() {
    $_logger.info('Initializing Rutor feed...');
    return {
      [RutorFeed.type]: new RutorFeed(),
    };
  }

  constructor() {
    super();

    $_logger.info('Rutor feed initialized!');
  }

  async fetch(query) {
    try {
      const _torrents = [];

      const _url = this._prepareUrl(query);

      const _response = await axios.get(_url);

      const $ = load(_response.data);

      $('.gai, .tum').each((i, el) => {
        if (!el) {
          return;
        }

        const _downloadLink = $(el).find('.downgif').first().attr('href');
        const _date = $(el).find('td').first().text().trim();
        const _title = $(el).find('td:nth-child(2)').first().text().trim();
        const _size = $(el).find('td[align="right"]').text().trim();
        const _seeders = $(el).find('.green').first().text().trim();
        const _peers = $(el).find('.red').first().text().trim();

        _torrents.push(new FeedItem(
          _title,
          this._convertToBytes(_size),
          _seeders,
          _peers,
          this._parseDate(_date),
          _downloadLink,
        ));
      });

      $_logger.info(`Found ${_torrents.length} torrents`, {
        query: query,
      });

      return _torrents;
    } catch (error) {
      $_logger.error(error, {
        query: query,
      });
      return Promise.reject(error);
    }
  }

  /**
   * Prepare URL
   * @param {Record<string, any>} query Query parameters
   * @private
   * @returns {string}
   * @private
   */
  _prepareUrl(query) {
    const _page = Math.max(query.page ?? 1, 1) - 1;

    const _category = query.category ?? 'any';
    const _sortBy = query.sortBy ?? 'date-desc';

    const _categoryNum = RutorFeed._categories.get(_category);
    const _sortByNum = RutorFeed._sortBy.get(_sortBy);

    return `${RutorFeed.url}/${_page}/${_categoryNum}/0/${_sortByNum}`;
  }

  /**
   * Parse size
   * @param {string} sizeStr Size string
   * @returns {number}
   * @private
   */
  _convertToBytes(sizeStr) {
    const _units = {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4,
    };

    const _match = sizeStr.match(/([\d.]+)\s?(B|KB|MB|GB|TB)/i);
    if (!_match) {
      const _error = new Error(`Invalid size string: ${sizeStr}`);
      $_logger.error(_error);
      throw _error;
    }

    const _value = parseFloat(_match[1]);
    const _unit = _match[2].toUpperCase();

    return Math.round(_value * _units[_unit]);
  }

  /**
   * Parse date
   * @param {string} dateStr Date string
   * @returns {Date}
   * @private
   */
  _parseDate(dateStr) {
    const [day, monthStr, yearStr] = dateStr.replace(/\s/g, ' ').split(' ');

    const _dayNum = parseInt(day, 10);
    const _monthNum = RutorFeed._months.get(monthStr);
    const _yearNum = parseInt(yearStr, 10) + 2000;

    return new Date(_yearNum, _monthNum, _dayNum);
  };
}