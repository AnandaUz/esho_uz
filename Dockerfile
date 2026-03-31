FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY shared/ ./shared/

# Устанавливаем ВСЕ зависимости включая dev
RUN npm install --workspace=server --include=dev

COPY server/src ./server/src
COPY server/tsconfig.json ./server/
COPY tsconfig.base.json ./

RUN npm run build:server

# После билда удаляем dev зависимости
RUN npm prune --workspace=server --omit=dev

EXPOSE 8080
CMD ["node", "server/dist/index.js"]