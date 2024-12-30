import { bootstrap } from './src/index.mjs';
import { Logger } from './src/common/logger.mjs';

const $_logger = new Logger('Main');

bootstrap().then(({ protocol, host, port }) => {
  $_logger.info(`Server is running at ${protocol}://${host}:${port}`);
}).catch((error) => {
  $_logger.error(error);
});