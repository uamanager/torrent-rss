FROM node:lts

WORKDIR /torrent-rss

COPY . .

RUN yarn install --frozen-lockfile

EXPOSE 3000

CMD ["node", "/torrent-rss/index.mjs"]
