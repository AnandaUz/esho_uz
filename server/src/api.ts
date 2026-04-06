import './config';
import { Telegraf } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const BOT_ADMIN = process.env.BOT_ADMIN || '';

export const bot = new Telegraf(BOT_TOKEN);


bot.start(async (ctx) => {
    if (!ctx.from) return;

    const firstName = ctx.from.first_name || "";
    const lastName = ctx.from.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim() || "Пользователь";

    // маппинг параметра start → текст заявки
    const rawPayload = ctx.payload ?? "";
    const params = rawPayload.split("__");
    const payload = params[0];
    
    const userID = params[1] || "";
    let typeText = "";

    switch (payload) {
        case "mastermind":
            typeText = "на МАСТЕРМАЙНД";
            break;
        case "coaching":
            typeText = "на КОУЧ-СЕССИЮ";
            break;
        case "meet":
            typeText = "на бесплатную встречу";
            break;
        case "question":
            typeText = "на вопрос";
            break;
        default:
            typeText = "";
            break;
    }
    const suffix = typeText ? ` ${typeText}` : "";
    let clientMsg = `✅ Ваша заявка${suffix} отправлена! В самое ближайшее время я (Ананда @ananda_uz) отвечу вам в личном сообщении`;

    if (payload === "question") {
        clientMsg = `✅ Я рад вашему сообщению! 
В самое ближайшее время я (Ананда @ananda_uz) напишу вам в личном сообщении, и вы сможете задать свой вопрос`;
    }
    if (payload === "meet") {
        clientMsg = `✅ Я благодарю вас за регистрацию! 
В самое ближайшее время я (Ананда @ananda_uz) напишу вам в личном сообщении, и мы подберём удобное для вас время.

И я рад поделиться с вами гайдом "Трансформация без саботажа", вы сможете почитать его пока я вам отвечаю.

Ссылка https://esho.uz/guide`;
    }
    const username = ctx.from.username;

    const adminMsg = `${userID} 📩 Новая заявка${suffix}
От: ${fullName}
ID: <code>${ctx.from.id}</code>
${username ? `Username: @${username}` : "Username: нет"}
Ссылка: <a href="tg://user?id=${ctx.from.id}">${fullName}</a>`;
    // Сообщения
    await sendMessageToAdmin(adminMsg);
    await ctx.reply(clientMsg);
});


bot.on("message", async (ctx) => {
    if (!ctx.from) return;

    const firstName = ctx.from.first_name || "";
    const lastName = ctx.from.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim() || "Пользователь";
    const username = ctx.from.username;

    const userDisplay = username
        ? `${fullName} (@${username})`
        : `${fullName} — ID: <code>${ctx.from.id}</code>`;

    const text = (ctx.message as any).text || "[не текст]";

    const adminMsg = `💬 Сообщение от: ${userDisplay}\n\n${text}`;
    await sendMessageToAdmin(adminMsg);
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
