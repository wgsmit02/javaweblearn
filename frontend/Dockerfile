# ============================================================
# Stage 1: BUILD
# Node image compiles the React app into static files
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /build

# Install dependencies first (cached layer if package.json unchanged)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build
# Output is in /build/dist — static HTML, JS, CSS files

# ============================================================
# Stage 2: SERVE
# Nginx serves the static files — tiny image, no Node runtime
# ============================================================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from Stage 1
COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost/index.html || exit 1
