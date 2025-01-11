import { Logger } from '../../common/logger.mjs';
import { RutorRequest } from './rutor.request.mjs';
import { BaseFeed } from '../base.feed.mjs';
import { RutorResponse } from './rutor.response.mjs';
import { FeedDetails } from '../feed-details.mjs';
import { RUTOR_CATEGORIES_QUERY_ANY } from './category.query.mjs';
import { RUTOR_SORT_BY_QUERY_DATE_DESC } from './sort-by.query.mjs';

export const RUTOR_BASE_URL = 'https://rutor.info';

/**
 * Rutor feed
 * @class RutorFeed
 * @extends BaseFeed
 */
export class RutorFeed extends BaseFeed {
  $_logger = new Logger(this.constructor.name);
  $_request = new RutorRequest();
  $_response = new RutorResponse();

  static type = 'rutor';

  constructor() {
    super();

    this.$_logger.info('Rutor feed initialized!');
  }

  async execute(query) {
    try {
      const _category = query.category ?? RUTOR_CATEGORIES_QUERY_ANY;
      const _sortBy = query.sortBy ?? RUTOR_SORT_BY_QUERY_DATE_DESC;
      const _pages = query.pages ?? 1;

      const _responses = await Promise.all(
        Array.from({ length: _pages }).fill(0).map(async (_, index) => {
          const _page = index + 1;

          const _requestResponse = await this.$_request.execute(RUTOR_BASE_URL, {
            category: _category,
            sortBy: _sortBy,
            page: _page,
          });

          return await this.$_response.execute(RUTOR_BASE_URL, _requestResponse);
        }),
      );


      const _title = this._mapTitle(
        _category,
        _sortBy,
        _pages,
      );
      const _description = this._mapDescription(
        _category,
        _sortBy,
        _pages,
      );
      const _feedUrl = this._mapFeedUrl();
      const _siteUrl = this._mapSiteUrl();
      const _language = this._mapLanguage();

      return new FeedDetails(
        _title,
        _description,
        _feedUrl,
        _siteUrl,
        _language,
        _responses.flat(),
      );
    } catch (error) {
      this.$_logger.error(error, {
        query: query,
      });
      return Promise.reject(error);
    }
  }

  _mapTitle(category, sortBy, pages) {
    return `${RutorFeed.type} - ${category} - ${sortBy} - ${pages}`;
  }

  _mapDescription(category, sortBy, pages) {
    return `${RutorFeed.type} - ${category} - ${sortBy} - ${pages}`;
  }

  _mapFeedUrl() {
    return new URL(RUTOR_BASE_URL);
  }

  _mapSiteUrl() {
    return new URL(RUTOR_BASE_URL);
  }

  _mapLanguage() {
    return 'en-us';
  }
}