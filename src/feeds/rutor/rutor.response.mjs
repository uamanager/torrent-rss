import { load } from 'cheerio';
import { convertToBytes } from '../../common/convert-to-bytes.mjs';
import { Logger } from '../../common/logger.mjs';
import { MONTHS } from '../../common/months.mjs';
import { FeedItem } from '../feed-item.mjs';

/**
 * Rutor response
 * @class RutorResponse
 */
export class RutorResponse {
  $_logger = new Logger(this.constructor.name);

  /**
   * Execute response parsing
   * @param {string} base Base URL
   * @param {string} response Response string
   * @returns {Promise<FeedItem[]>}
   */
  async execute(base, response) {
    try {
      this.$_logger.info('Executing response parsing...');

      const _result = this._parseBody(base, response);

      this.$_logger.info(`Response parsed. Found ${_result.length} torrents`);

      return _result;
    } catch (error) {
      this.$_logger.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Parse body
   * @param {string} base Base URL
   * @param {string} body Body
   * @returns {FeedItem[]}
   * @private
   */
  _parseBody(base, body) {
    const _items = [];
    const $ = load(body);

    $('.gai, .tum').each((index, element) => {
      if (!element) {
        return;
      }

      const _downloadUrlRaw = $(element).find('.downgif').first().attr('href');
      const _detailsUrlRaw = $(element).find('td>a:nth-child(3)').first().attr('href');
      const _dateRaw = $(element).find('td').first().text().trim();
      const _titleRaw = $(element).find('td:nth-child(2)').first().text().trim();
      const _sizeRaw = $(element).find('td[align="right"]').last().text().trim();
      const _seedersRaw = $(element).find('.green').first().text().trim();
      const _peersRaw = $(element).find('.red').first().text().trim();

      const _size = this._mapSize(_sizeRaw);
      const _seeders = this._mapSeeders(_seedersRaw);
      const _peers = this._mapPeers(_peersRaw);
      const _date = this._mapDate(_dateRaw);
      const _downloadUrl = this._mapDownloadUrl(_downloadUrlRaw);
      const _detailsUrl = this._mapDetailsUrl(base, _detailsUrlRaw);

      const _title = this._mapTitle(_titleRaw, {
        _size,
        _seeders,
        _peers,
        _date,
        _sizeRaw,
        _seedersRaw,
        _peersRaw,
        _dateRaw,
      });
      const _description = this._mapTitle(_titleRaw, {
        _size,
        _seeders,
        _peers,
        _date,
        _sizeRaw,
        _seedersRaw,
        _peersRaw,
        _dateRaw,
      });

      _items.push(new FeedItem(
        _title,
        _description,
        _size,
        _seeders,
        _peers,
        _date,
        _detailsUrl,
        _downloadUrl,
      ));
    });

    return _items;
  }

  _mapDate(dateStr) {
    const [day, monthStr, yearStr] = dateStr.replace(/\s/g, ' ').split(' ');

    const _dayNum = parseInt(day, 10);
    const _monthNum = MONTHS.get(monthStr);

    if (_monthNum === undefined) {
      const _error = new Error(`Invalid month string: ${monthStr}`);
      this.$_logger.error(_error, {
        date: dateStr,
      });
      throw _error;
    }

    const _yearNum = parseInt(yearStr, 10) + 2000;

    return new Date(_yearNum, _monthNum, _dayNum);
  }

  _mapSize(sizeStr) {
    return convertToBytes(sizeStr);
  }

  _mapTitle(titleStr, { _seeders, _peers, _sizeRaw }) {
    const _title = titleStr.toLowerCase();
    return `[S:${_seeders}/P:${_peers}][${this._mapResolution(_title)}][${this._mapHdr(_title)}](${_sizeRaw}) ${titleStr}`;
  }

  _mapSeeders(seedersStr) {
    return parseInt(seedersStr, 10);
  }

  _mapPeers(peersStr) {
    return parseInt(peersStr, 10);
  }

  _mapDetailsUrl(base, detailsUrlStr) {
    return new URL(`${base}/${detailsUrlStr}`);
  }

  _mapDownloadUrl(downloadUrlStr) {
    return new URL(downloadUrlStr.startsWith('http') ? downloadUrlStr : `https:${downloadUrlStr}`);
  }

  _mapHdr(title) {
    return /\b(HDR(?:10\+?)?|Dolby\s?Vision|DV|HLG)\b/i.test(title) ? 'HDR' : 'SDR';
  }

  _mapResolution(title) {
    const _4k = title.includes('4k') || title.includes('2160') || title.includes('uhd');
    const _2k = title.includes('2k') || title.includes('1440');
    const _1080 = title.includes('1080') || title.includes('fullhd') || title.includes('full hd');
    const _720 = title.includes('720') || (title.includes('hd') && !title.includes('hdr'));

    if (_4k) {
      return '4K';
    } else if (_2k) {
      return '2K';
    } else if (_1080) {
      return '1080P';
    } else if (_720) {
      return '720P';
    } else {
      return '-';
    }
  }
}