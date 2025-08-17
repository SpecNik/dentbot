# Telegram Mini App Starter

Минимальный шаблон: Telegram-бот + Mini App (веб-страница).

## Структура
- `web/index.html` — мини-приложение (WebApp), задеплой на Netlify/Vercel/GitHub Pages и возьми URL.
- `bot.js` — бот на Telegraf, отдаёт кнопку «Open Mini App» и принимает `web_app_data`.
- `.env.example` — образец переменных окружения.

## Быстрый старт
```bash
npm i
cp .env.example .env
# вставь BOT_TOKEN из @BotFather и MINIAPP_URL на твою страницу
npm start
```

## Деплой мини-приложения
Залей `web/index.html` на Netlify/Vercel/GitHub Pages и получи публичный URL. Пропиши его в `MINIAPP_URL`.

## Кнопка в Telegram
Бот отправляет клавиатуру с web_app-кнопкой. Нажатие откроет твоё мини-приложение внутри Telegram.

## Приём данных из Mini App
На странице вызывается `Telegram.WebApp.sendData(...)`, а в боте обрабатывается событие `web_app_data`.
