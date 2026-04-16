import '../../_base/server/config.js';
import express from 'express';
import cors from 'cors';

import { sendMessageToAdmin } from './api.js';
import { admin_bot, sendMessageTo_mainAdmin } from './controllers/tgbot_admin.controller.js';
import { botRegistry } from './bots/botRegistry.js'
import trackerRouter from './routers/tracker.routers.js';

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
  admin_bot.handleUpdate(req.body, res);
});

app.post('/track', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ ok: false });
  await sendMessageToAdmin(message);
  res.json({ ok: true });
});
app.post('/track_admin', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ ok: false });
  await sendMessageTo_mainAdmin(message);
  res.json({ ok: true });
});

// маршрут для Telegram webhook
app.post('/tg_bot_webhook', (req, res) => {
  const mode = req.query.mode as string;
  const bot = botRegistry.get(mode);

  if (!bot) {
    res.status(400).send(`Unknown bot mode: ${mode}`);
    return;
  }

  bot.handleUpdate(req.body, res);
});

app.use('/tracker', trackerRouter);

const PORT = Number(process.env.PORT || 8080);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

