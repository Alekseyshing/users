# Используем Node.js 18 как базовый образ
FROM node:18-alpine

# Создаем директорию для приложения
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Собираем TypeScript код
RUN npm run build

# Открываем порт
EXPOSE 5001

# Запускаем приложение
CMD ["npm", "start"]
