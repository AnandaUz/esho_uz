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

# Compile _base first so server build can use it if needed
RUN cd _base/server && npx tsc
RUN npm run build --workspace=server



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

# Copy compiled _base from builder stage (contains .js files)
COPY --from=builder /app/_base ./_base

# Replace symlink with actual compiled files to avoid resolution issues
RUN rm -rf node_modules/@base/shared && \
    cp -r _base node_modules/@base/shared

# Copy compiled server code
COPY --from=builder /app/server/dist ./server/dist

EXPOSE 8080

CMD ["node", "server/dist/index.js"]