import RSS from 'rss';
import { Logger } from '../common/logger.mjs';
import { Feeds } from '../feeds/feeds.registry.mjs';
import { AppServerRoute } from '../common/server/route.mjs';

export class GetRssRoute extends AppServerRoute {
  $_logger = new Logger(this.constructor.name);

  register($_app) {
    $_app.get('/rss', async (req, res) => {
      try {
        this.$_logger.info('Received request for RSS feed', {
          query: req.query,
        });

        const _feedQuery = req.query?.feed;

        if (!_feedQuery) {
          const _error = new Error('Feed not specified');
          this.$_logger.error(_error, {
            query: req.query,
          });
          res.status(400).send();
          return;
        }

        const _registeredFeed = Feeds.get(_feedQuery);

        if (!_registeredFeed) {
          const _error = new Error(`Feed '${_feedQuery}' not found`);
          this.$_logger.error(_error, {
            query: req.query,
          });
          res.status(404).send();
          return;
        }

        const _feedDetails = await _registeredFeed.execute(req.query);

        this.$_logger.info(`Received ${_feedDetails.items.length} items from feed '${_feedQuery}'`, {
          query: req.query,
        });

        const _feed = new RSS({
          title: _feedDetails.title,
          description: _feedDetails.description,
          feed_url: _feedDetails.feed_url,
          site_url: _feedDetails.site_url,
          language: _feedDetails.language,
        });

        _feedDetails.items.forEach((item) => {
          _feed.item({
            title: item.title,
            description: item.description,

            date: item.date,
            guid: item.detailsUrl,
            url: item.detailsUrl,

            enclosure: {
              type: 'application/x-bittorrent',
              url: item.downloadUrl,
              size: item.size,
            },
          });
        });

        res.set('Content-Type', 'application/xml')
          .send(_feed.xml({ indent: true }));
      } catch (error) {
        this.$_logger.error(error, {
          query: req.query,
        });
        res.status(500).send();
      }
    });
  }
}