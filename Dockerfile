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
COPY _base ./_base

RUN npm run build --workspace=server

# Показать реальную структуру dist
RUN find /app/server/dist -name "*.js" | head -20

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy only what's needed for production dependencies
COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy compiled server code (includes compiled _base and server logic)
COPY --from=builder /app/server/dist /app/server/dist

# Verify the file structure in the logs
RUN find /app/server/dist -name "index.js"

EXPOSE 8080
# Explicit absolute path for the entrypoint
CMD ["node", "/app/server/dist/server/src/index.js"]
