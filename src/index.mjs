import express from 'express';
import { getRss } from './api/rss.api.mjs';
import { RutorFeed } from './feeds/rutor.feed.mjs';
import { Logger } from './common/logger.mjs';

const PROTOCOL = process.env.PROTOCOL || 'http';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

const $_logger = new Logger('Bootstrap');

export function bootstrap() {
  return new Promise((resolve, reject) => {
    try {
      $_logger.info('Bootstrapping server...');

      const FEEDS = {
        ...RutorFeed.init(),
      };

      const $_app = express();

      getRss($_app, new Map(Object.entries(FEEDS)));

      $_app.listen(PORT, HOST, () => {
        $_logger.info(`Successfully bootstrapped server!`);
        resolve({
          protocol: PROTOCOL,
          host: HOST,
          port: PORT,
        });
      });
    } catch (error) {
      $_logger.error(error);
      reject(error);
    }
  });
}