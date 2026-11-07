FROM oven/bun:1-alpine
WORKDIR /app
COPY server/inquiry.mjs server/newsletter.mjs server/booking.mjs ./
USER bun
EXPOSE 8080
CMD ["bun", "inquiry.mjs"]
