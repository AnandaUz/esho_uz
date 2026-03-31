import 'dotenv/config';
import { Telegraf } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const BOT_ADMIN = process.env.BOT_ADMIN || '';

const bot = new Telegraf(BOT_TOKEN);


bot.start(async (ctx) => {
    if (!ctx.from) return;

    const firstName = ctx.from.first_name || "";
    const lastName = ctx.from.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim() || "Пользователь";

    // читаем параметр start
    const args = ctx.startPayload || ""; 

    let typeText = "";
    if (args === "mastermind") typeText = "на МАСТЕРМАЙНД";
    else if (args === "coaching") typeText = "на КОУЧ-СЕССИЮ";
    else if (args === "meet") typeText = "на бесплатную встречу";

    const suffix = typeText ? ` ${typeText}` : "";
    const clientMsg = `✅ Ваша заявка${suffix} отправлена! В самое ближайшее время я (Ананда @ananda_uz) отвечу вам в личном сообщении`;

    const username = ctx.from.username;
    const userDisplay = username 
        ? `${fullName} (@${username})` 
        : `<a href="tg://user?id=${ctx.from.id}">${fullName}</a>`;

    const adminMsg = `📩 Новая заявка${suffix}\nОт: ${userDisplay}`;

    // Сообщения
    await sendMessageToAdmin(adminMsg);
    await ctx.reply(clientMsg);
});
export async function sendMessageToAdmin(message: string) {
    try {
        await bot.telegram.sendMessage(BOT_ADMIN, message,
            {
                parse_mode: 'HTML',
                link_preview_options: {
                    is_disabled: true
                }
            });
        return { success: true };
    } catch (error: any) {
        console.error("Error sending message to admin:", error);
        return { success: false, error: error.message };
    }
}
