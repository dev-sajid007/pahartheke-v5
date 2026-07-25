FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 express
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN chown -R express:nodejs .
USER express
EXPOSE 5000
CMD ["node", "src/server.js"]
