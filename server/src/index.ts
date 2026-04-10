import '../../_base/server/config.js';
import express from 'express';
import cors from 'cors';

import { bot, sendMessageToAdmin } from './api.js';
import { admin_bot } from './controllers/tgbot_admin.controller.js';

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || '';


app.use(cors({
  origin: CLIENT_URL
}));
app.use(express.json());

app.get("/", (_req, res) => {
    res.send("работаю");
});

app.post('/tgbot_admin_webhook', (req, res) => {
  // bot.handleUpdate принимает объект обновления и объект ответа express  
  console.log('tgbot_admin_webhook');
  admin_bot.handleUpdate(req.body, res);
});

app.post('/track', async (req, res) => {
  const { message } = req.body;
  console.log('track');
  if (!message) return res.status(400).json({ ok: false });
  await sendMessageToAdmin(message);
  res.json({ ok: true });
});

// маршрут для Telegram webhook
app.post('/tg_bot_webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

const PORT = Number(process.env.PORT || 8080);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

