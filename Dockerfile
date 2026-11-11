# Build the static Astro site with Bun
FROM oven/bun:1 AS builder
WORKDIR /app

# Install dependencies (fails the build if bun.lock is out of sync with package.json)
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build the site
COPY . .
ENV NODE_ENV=production
ARG PUBLIC_INQUIRY_ENABLED=false
ARG PUBLIC_NEWSLETTER_ENABLED=false
ENV PUBLIC_NEWSLETTER_ENABLED=$PUBLIC_NEWSLETTER_ENABLED
ARG PUBLIC_POSTHOG_KEY
ENV PUBLIC_INQUIRY_ENABLED=$PUBLIC_INQUIRY_ENABLED
ENV PUBLIC_POSTHOG_KEY=$PUBLIC_POSTHOG_KEY
RUN bun run build

FROM oven/bun:1 AS production-deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

# Private-network renderer for the ERP preview; no public port or ERP credentials.
FROM node:24-bookworm-slim AS preview
WORKDIR /app
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=production-deps --chown=node:node /app/node_modules ./node_modules
USER node
ENV HOST=0.0.0.0 PORT=4321 NODE_ENV=production
EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]

# Serve the static output with nginx
FROM nginx:1.27-alpine AS runner

RUN addgroup -g 1001 -S web && adduser -u 1001 -S web -G web

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=web:web /app/dist/client /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
