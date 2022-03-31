FROM node:16-alpine

ENV TZ=Europe/Lisbon
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apk update && apk add --no-cache \
	g++ \
	make \
	python3 \
	python2 \
	sqlite

WORKDIR /src/app
COPY . .

RUN npm install

RUN apk del g++ make python3 python2

RUN cat data/exylliandb.sql | sqlite3 data/ExyllianDB.db

RUN node deploy-commands.js
CMD [ "node", "index.js" ]
