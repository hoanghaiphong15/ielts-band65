# Robust Dockerfile for IELTS Band 6.5 API Server on Render
FROM node:20-slim

WORKDIR /app

# Install OpenSSL for Prisma SQLite engine
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package manifests
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm ci

# Copy source code and pre-seeded database
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build shared library and compile API
RUN npm run build --workspace=@ielts/shared
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

# Configure runtime environment
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/server.js"]
