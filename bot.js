import { Telegraf, Markup } from 'telegraf';
import 'dotenv/config';

const BOT_TOKEN = process.env.BOT_TOKEN;
const MINIAPP_URL = process.env.MINIAPP_URL || 'https://your-miniapp-url.example';

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is missing. Put it into .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply(
    'Открой мини-приложение:',
    Markup.keyboard([
      Markup.button.webApp('Open Mini App', MINIAPP_URL)
    ]).resize()
  );
});

bot.on('web_app_data', (ctx) => {
  try {
    const payload = JSON.parse(ctx.message.web_app_data.data || '{}');
    console.log('From mini-app:', payload);
    ctx.reply('Принял данные из мини-аппа ✅');
  } catch (e) {
    console.error('Bad web_app_data:', e);
    ctx.reply('Не удалось разобрать данные 🙈');
  }
});

bot.launch();
console.log('Bot started');
