FROM oven/bun:1-alpine
WORKDIR /app
COPY server/inquiry.mjs ./inquiry.mjs
USER bun
EXPOSE 8080
CMD ["bun", "inquiry.mjs"]
