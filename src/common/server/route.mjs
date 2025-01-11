/**
 * App server route
 * @abstract
 * @class AppServerRoute
 */
export class AppServerRoute {
  /**
   * Register route
   * @param {Express} $_app Express app
   * @returns {void}
   */
  register($_app) {
    throw new Error('Not implemented');
  }
}