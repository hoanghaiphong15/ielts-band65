# Multi-stage Dockerfile for IELTS Band 6.5 API Server
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/api/package*.json ./apps/api/

# Install all dependencies
RUN npm ci

# Copy source code and prisma
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build shared library and API
RUN npm run build --workspace=@ielts/shared
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/api/package*.json ./apps/api/

# Install production dependencies
RUN npm ci --omit=dev

# Copy compiled outputs and database
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/node_modules/.prisma ./apps/api/node_modules/.prisma
COPY --from=builder /app/apps/api/node_modules/@prisma ./apps/api/node_modules/@prisma

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "dist/server.js"]
