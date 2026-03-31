FROM node:22-alpine

WORKDIR /app

# Копируем корневой package.json (монорепо)
COPY package.json package-lock.json ./

# Копируем package.json пакетов
COPY server/package.json ./server/
COPY shared/ ./shared/

# Устанавливаем зависимости
RUN npm install --workspace=server

# Копируем исходники
COPY server/src ./server/src
COPY server/tsconfig.json ./server/
COPY tsconfig.base.json ./

# Билдим
RUN npm run build:server

# Запускаем
EXPOSE 8080
CMD ["node", "server/dist/index.js"]