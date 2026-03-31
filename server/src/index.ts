import './config';
import express from 'express';
import cors from 'cors';

import { sendMessageToAdmin } from './api';

const app = express();

const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL || '';

app.use(cors({
  origin: CLIENT_URL
}));
app.use(express.json());

app.get("/", (_req, res) => {
    res.send("работаю");
});
app.post('/track', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ ok: false });
  await sendMessageToAdmin(message);
  res.json({ ok: true });
});
// маршрут для Telegram
// app.post("/bot", api);

app.post("/submit-form", async (req, res) => {
    const { userName, userContact } = req.body;
    
    if (!userName || !userContact) {
        return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const message = `📩 <b>Новая заявка с сайта (Встреча)</b>\n\nИмя: ${userName}\nКонтакт: ${userContact}`;
    
    const result = await sendMessageToAdmin(message);
    
    if (result.success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: result.error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


