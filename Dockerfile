# ИСПРАВЛЕНО: Заменили 18-alpine на 20-alpine
FROM node:20-alpine AS development-stage

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы с зависимостями
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая dev для сборки)
RUN npm ci

# Копируем весь исходный код
COPY . .

# Собираем приложение (если используется TypeScript)
RUN npm run build

# Этап production
# Тут уже правильно - 20-alpine
FROM node:20-alpine AS production-stage

WORKDIR /app

# Копируем ТОЛЬКО production-зависимости
COPY package*.json ./
RUN npm ci --only=production

# Копируем собранный JavaScript-код из stage-1
COPY --from=development-stage /app/dist ./dist

# Создаем непривилегированного пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
# Меняем владельца файлов
RUN chown -R nestjs:nodejs /app
# Переключаемся на него
USER nestjs

# Запускаем приложение
CMD ["node", "dist/main"]