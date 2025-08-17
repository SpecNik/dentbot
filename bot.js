// bot.js
import { Telegraf, Markup } from 'telegraf';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// ---- ENV
const BOT_TOKEN = process.env.BOT_TOKEN;
const MINIAPP_URL = process.env.MINIAPP_URL || 'https://your-miniapp-url.example';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY; // на сервере лучше service role

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is missing. Put it into .env');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase env is missing. Writing to DB will be skipped.');
}

// ---- Supabase client (если есть ключи)
const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// ---- Bot
const bot = new Telegraf(BOT_TOKEN);

// Кнопка для открытия Mini App
bot.start((ctx) => {
  return ctx.reply(
    'Открой мини-приложение:',
    Markup.keyboard([
      Markup.button.webApp('Open Mini App', MINIAPP_URL)
    ]).resize()
  );
});

// Приём данных из Mini App и сохранение в БД
bot.on('web_app_data', async (ctx) => {
  try {
    const payload = JSON.parse(ctx.message.web_app_data.data || '{}');
    console.log('From mini-app:', payload);

    // ожидаем формат: { type:'appointment', payload:{ name, phone, date, time, notes } }
    if (payload?.type === 'appointment' && payload?.payload) {
      if (!supabase) {
        await ctx.reply('Запись получена ✅ (БД не настроена)');
        return;
      }
      const a = payload.payload;
      const { error } = await supabase.from('appointments').insert([{
        tg_user_id: ctx.from?.id ?? null,
        name: a.name,
        phone: a.phone || null,
        date: a.date,
        time: a.time,
        notes: a.notes || null
      }]);
      if (error) {
        console.error('Supabase insert error:', error);
        await ctx.reply('Не удалось сохранить в БД 🙈');
      } else {
        await ctx.reply(
          `🦷 Запись сохранена:\n` +
          `Пациент: ${a.name}\nДата: ${a.date} ${a.time}\nТел: ${a.phone || '—'}\nЗаметка: ${a.notes || '—'}`
        );
      }
    } else {
      await ctx.reply('Принял данные из мини-аппа ✅');
    }
  } catch (e) {
    console.error('Bad web_app_data:', e);
    await ctx.reply('Не удалось разобрать данные 🙈');
  }
});

// Аккуратное завершение
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch();
console.log('Bot started');