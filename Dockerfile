FROM node:lts-alpine

WORKDIR /torrent-rss

COPY . .

RUN yarn install --frozen-lockfile --production

CMD ["node", "/torrent-rss/index.mjs"]
