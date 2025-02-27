FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies for node-gyp and other native modules
RUN apk add --no-cache libc6-compat python3 make g++

# Copy monorepo package files
COPY ./server/package.json ./server/package-lock.json* ./server/
COPY ./common/package.json ./common/

# First install common dependencies (if any)
WORKDIR /app/common
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Then install server dependencies
WORKDIR /app/server
RUN npm ci

# Development image
FROM base AS development
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/common/node_modules ./common/node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy project files
COPY ./common ./common
COPY ./server ./server

# Expose the API port
EXPOSE 3333

WORKDIR /app/server
CMD ["npm", "run", "dev"]

# Production build image
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/common/node_modules ./common/node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy project files
COPY ./common ./common
COPY ./server ./server

# Build the server
WORKDIR /app/server
RUN npm run build

# Production image
FROM base AS production
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/common/node_modules ./common/node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy the common package
COPY ./common ./common

# Copy the built server
COPY --from=builder /app/server/dist ./server/dist
COPY ./server/package.json ./server/

# Expose the API port
EXPOSE 3333

# Set environment variables
ENV NODE_ENV=production

WORKDIR /app/server
CMD ["node", "dist/index.js"]