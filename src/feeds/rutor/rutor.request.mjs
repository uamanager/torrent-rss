import axios from 'axios';
import { Logger } from '../../common/logger.mjs';
import { RUTOR_CATEGORIES_QUERY, RUTOR_CATEGORIES_QUERY_ANY } from './category.query.mjs';
import { RUTOR_SORT_BY_QUERY, RUTOR_SORT_BY_QUERY_DATE_DESC } from './sort-by.query.mjs';

/**
 * Rutor request
 * @class RutorRequest
 */
export class RutorRequest {
  $_logger = new Logger(this.constructor.name);

  /**
   * Execute request
   * @param {string} base Base URL
   * @param {{category?: string, sortBy?: string, page?: number}} query Query parameters
   * @returns {Promise<string>}
   */
  async execute(base, { category, sortBy, page }) {
    try {
      this.$_logger.info('Executing request...', {
        category,
        sortBy,
        page,
      });

      const _category = this._mapCategory(category);
      const _sortBy = this._mapSortBy(sortBy);
      const _page = this._mapPage(page);

      const _url = this._prepareUrl(base, _category, _sortBy, _page);
      this.$_logger.info('Requesting URL:', {
        category: _category,
        sortBy: _sortBy,
        page: _page,
        url: _url,
      });

      return await axios.get(_url).then((res) => {
        this.$_logger.info('Received response:', {
          category: _category,
          sortBy: _sortBy,
          page: _page,
          url: _url,
          status: res.status,
          length: res.data.length,
        });

        return res.data;
      });
    } catch (error) {
      this.$_logger.error(error, {
        category,
        sortBy,
        page,
      });
      return Promise.reject(error);
    }
  }

  _mapCategory(category = RUTOR_CATEGORIES_QUERY_ANY) {
    return RUTOR_CATEGORIES_QUERY.get(category) ?? 0;
  }

  _mapSortBy(sortBy = RUTOR_SORT_BY_QUERY_DATE_DESC) {
    return RUTOR_SORT_BY_QUERY.get(sortBy) ?? 0;
  }

  _mapPage(page = 1) {
    return Math.max(page, 1) - 1;
  }

  _prepareUrl(base, category = 0, sortBy = 0, page = 0) {
    return `${base}/browse/${page}/${category}/0/${sortBy}`;
  }
}