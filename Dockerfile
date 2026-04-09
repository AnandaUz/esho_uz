FROM node:20-slim


# Устанавливаем git
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN git clone https://github.com/AnandaUz/_base.git /tmp/_base && \
    mv /tmp/_base _base && \
    rm -rf _base/.git

COPY package*.json ./
COPY server/package*.json ./server/

RUN npm install

COPY . .

RUN npm run build:server

CMD ["node", "server/dist/server/src/index.js"]