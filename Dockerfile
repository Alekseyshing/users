# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Компилируем TypeScript в JavaScript
RUN npm run build

# Указываем переменную окружения
ENV PORT=5001

# Открываем порт
EXPOSE 5001

# Команда для запуска сервера
CMD ["npm", "start"]
