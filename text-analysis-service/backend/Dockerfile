FROM node:18-alpine

WORKDIR /app

# Установка curl для health checks
RUN apk add --no-cache curl

# Копирование package files
COPY package*.json ./

# Установка зависимостей
RUN npm ci --only=production

# Копирование кода приложения
COPY src/ ./src/

# Открытие порта
EXPOSE 3001

# Запуск приложения
CMD ["node", "src/server.js"]

