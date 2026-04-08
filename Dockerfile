# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/
COPY _base ./_base

RUN npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build --workspace=server

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY _base ./_base

RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/server/dist ./server/dist

EXPOSE 8080

CMD ["node", "server/dist/index.js"]