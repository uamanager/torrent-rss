import express from 'express';
import { Logger } from '../logger.mjs';

export const APP_SERVER_PROTOCOL_DEFAULT = 'http';
export const APP_SERVER_HOST_DEFAULT = '0.0.0.0';
export const APP_SERVER_PORT_DEFAULT = 3000;

/**
 * App server
 * @class AppServer
 */
export class AppServer {
  $_app = express();
  $_logger = new Logger(this.constructor.name);

  /**
   * Register route
   * @param {AppServerRoute} route Route
   */
  route(route) {
    route.register(this.$_app);
  }

  /**
   * Bootstrap server
   * @param {string?} protocol Protocol to use
   * @param {string?} host Hostname to bind
   * @param {number?} port Port to listen on
   * @returns {Promise<{protocol: string, host: string, port: number}>}
   */
  bootstrap(
    protocol = APP_SERVER_PROTOCOL_DEFAULT,
    host = APP_SERVER_HOST_DEFAULT,
    port = APP_SERVER_PORT_DEFAULT,
  ) {
    return new Promise((resolve, reject) => {
      try {
        this.$_logger.info('Bootstrapping server...');

        this.$_app.listen(port, host, () => {
          this.$_logger.info(`Successfully bootstrapped server!`);
          resolve({
            protocol,
            host,
            port,
          });
        });
      } catch (error) {
        this.$_logger.error(error);
        reject(error);
      }
    });
  }
}

export const App = new AppServer();
