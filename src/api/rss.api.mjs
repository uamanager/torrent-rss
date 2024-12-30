import RSS from 'rss';
import { Logger } from '../common/logger.mjs';

const $_logger = new Logger('RSS API');

/**
 * Get RSS feed
 * @param {Express} $_app Express app
 * @param {Map<string, BaseFeed>} $_feeds Registered feeds
 */
export function getRss($_app, $_feeds) {
  $_app.get('/rss', async (req, res) => {
    $_logger.info('Received request for RSS feed', {
      query: req.query,
    });

    const _feedQuery = req.query?.feed;

    if (!_feedQuery) {
      const _error = new Error('Feed not specified');
      $_logger.error(_error, {
        query: req.query,
      });
      res.status(400).send();
      return;
    }

    const _registeredFeed = $_feeds.get(_feedQuery);

    if (!_registeredFeed) {
      const _error = new Error(`Feed '${_feedQuery}' not found`);
      $_logger.error(_error, {
        query: req.query,
      });
      res.status(404).send();
      return;
    }

    const _feedResult = await _registeredFeed.fetch(req.query);

    $_logger.info(`Received ${_feedResult.length} items from feed '${_feedQuery}'`, {
      query: req.query,
    });

    const _feed = new RSS({
      title: `Announcement Feed - ${_feedQuery}`,
      description: `Announcement Feed - ${_feedQuery}`,
      feed_url: req.originalUrl,
      site_url: req.originalUrl,
      language: 'en-us',
    });

    _feedResult.forEach((item) => {
      _feed.item({
        title: item.title,
        description: item.description,

        date: item.date,
        guid: item.url,
        url: item.url,

        enclosure: {
          type: 'application/x-bittorrent',
          url: item.url,
          size: item.size,
        },
        custom_elements: [
          {
            link: item.url,
          },
          {
            pubDate: item.date,
          },
        ],
      });
    });

    res.set('Content-Type', 'application/xml')
      .send(_feed.xml({ indent: true }));
  });
}