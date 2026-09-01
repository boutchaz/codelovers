# Build the static Astro site with Bun
FROM oven/bun:1 AS builder
WORKDIR /app

# Install dependencies (fails the build if bun.lock is out of sync with package.json)
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build the site
COPY . .
ENV NODE_ENV=production
RUN bun run build

# Serve the static output with nginx
FROM nginx:1.27-alpine AS runner

RUN addgroup -g 1001 -S web && adduser -u 1001 -S web -G web

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=web:web /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
