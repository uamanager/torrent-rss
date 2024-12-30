
# torrent-rss

A Node.js service that fetches torrent data from various sources and exposes them as RSS feeds.

## Features
- Plug-and-play architecture for multiple feed parsers
- RSS endpoint (`/rss`) that can be customized with query parameters

## Adding Your Own Feeds
To add a new feed parser:
1. Create a new class extending the `BaseFeed` class.
2. Implement the `fetch` method to parse the desired feed.
3. Add the feed to the `FEEDS` map in the `bootstrap()` function.
4. Access it via `GET /rss?feed=<feedName>`.

## Quick Start
1. **Install dependencies**
   ```bash
   yarn install
   ```
2. **Run the service**
   ```bash
   yarn start
   ```
3. **Test the service**
   Open `http://localhost:3000/rss?feed=feedName` in your browser or any RSS reader.

## Docker
### From Docker Hub
1. **Pull the Docker image**
   ```bash
   docker pull ghcr.io/uamanager/torrent-rss:main
   ```
2. **Run the container**
   ```bash
   docker run -p 3000:3000 ghcr.io/uamanager/torrent-rss:main
   ```

### Build Locally
1. **Build the Docker image**
   ```bash
   docker build -t torrent-rss .
   ```
2. **Run the container**
   ```bash
   docker run -p 3000:3000 torrent-rss
   ```

The server listens on port `3000` by default. You can customize this with the following environment variables:
- `PROTOCOL` – Protocol to use (default: `http`)
- `HOST` – Hostname to bind (default: `0.0.0.0`)
- `PORT` – Port to listen on (default: `3000`)

## Endpoints
### `GET /rss`
Fetches RSS feed data.

#### Query Parameters
- `feed` *(required)*: The name of the feed parser to use.
- Custom parameters supported by the feed parser.

Example:
```http
GET /rss?feed=feedName&category=movies&page=1&sortBy=seeders-desc
```

## Contributing
Contributions are welcome! Feel free to submit pull requests or open issues for bugs and feature requests.

## License
This project is licensed under the MIT License.
