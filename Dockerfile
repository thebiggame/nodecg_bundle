FROM node:22.14-slim AS build

# WORKAROUND https://github.com/nodecg/vite-plugin-nodecg/issues/21
WORKDIR /usr/src/app/thebiggame

COPY package*.json ./

RUN apt-get update && apt-get install -y python3 git make g++ sqlite3 libsqlite3-dev && rm -rf /var/lib/apt/lists/*

RUN npm install

COPY . ./

RUN npm run build

# Final environment
FROM node:22.14-slim

WORKDIR /opt/app

COPY package*.json ./

RUN apt-get update && apt-get install -y python3 git make g++ sqlite3 libsqlite3-dev && rm -rf /var/lib/apt/lists/*

RUN npm install --omit=dev && npm cache clean --force

COPY --from=build /usr/src/app/thebiggame .

VOLUME /opt/app/cfg /opt/app/logs /opt/app/db /opt/app/assets

EXPOSE 9090/tcp

CMD ["npm", "run", "start"]