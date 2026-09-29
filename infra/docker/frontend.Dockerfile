# DastKar Hub — Production Frontend Dockerfile
# Stage 1: Build Vite / React 19 Client
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests
COPY apps/web/package.json apps/web/package-lock.json* ./

# Install dependencies cleanly
RUN npm ci

# Copy web source code
COPY apps/web ./

# Build production bundle
RUN npm run build

# Stage 2: Serve with High-Performance Nginx Alpine
FROM nginx:alpine AS runtime

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built static assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing & asset caching
COPY infra/docker/nginx-frontend.conf /etc/nginx/conf.d/default.conf

# Security headers & non-root permissions
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
