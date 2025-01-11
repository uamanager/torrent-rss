import { Logger } from './common/logger.mjs';
import {
  App,
  APP_SERVER_HOST_DEFAULT,
  APP_SERVER_PORT_DEFAULT,
  APP_SERVER_PROTOCOL_DEFAULT,
} from './common/server/server.mjs';
import { GetRssRoute } from './routes/rss.route.mjs';

const PROTOCOL = process.env.PROTOCOL ?? APP_SERVER_PROTOCOL_DEFAULT;
const HOST = process.env.HOST ?? APP_SERVER_HOST_DEFAULT;
const PORT = +(process.env.PORT ?? APP_SERVER_PORT_DEFAULT);

const $_logger = new Logger('Bootstrap');

export async function bootstrap() {
  try {
    App.route(new GetRssRoute());

    return await App.bootstrap(PROTOCOL, HOST, PORT);
  } catch (error) {
    $_logger.error(error);
    return Promise.reject(error);
  }
}