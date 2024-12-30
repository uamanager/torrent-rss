FROM node:lts

WORKDIR /torrent-rss

COPY . .

RUN yarn install --frozen-lockfile

CMD ["node", "/torrent-rss/index.mjs"]
