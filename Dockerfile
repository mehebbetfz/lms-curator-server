# Упрощенная версия для бекенда
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production  # ТОЛЬКО production зависимости
COPY . .
RUN npm run build

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs
CMD ["node", "dist/main"]