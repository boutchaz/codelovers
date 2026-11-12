FROM oven/bun:1-alpine
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY server/inquiry.mjs server/newsletter.mjs server/booking.mjs server/analytics.mjs ./
USER bun
EXPOSE 8080
CMD ["bun", "inquiry.mjs"]
