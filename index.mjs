import { bootstrap } from './src/index.mjs';
import { Logger } from './src/common/logger.mjs';
import { Feeds } from './src/feeds/feeds.registry.mjs';
import { RutorFeed } from './src/feeds/rutor/rutor.feed.mjs';

const $_logger = new Logger();

Feeds.register(RutorFeed.type, new RutorFeed());

bootstrap().then(({ protocol, host, port }) => {
  $_logger.info(`Server is running at ${protocol}://${host}:${port}`);
}).catch((error) => {
  $_logger.error(error);
});