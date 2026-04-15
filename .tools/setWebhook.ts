import '../_base/server/config';
import { setWebhook2, Links } from "../_base/_tools/setWebhook";

const ngrokUrl = 'f2cd-92-253-192-234'

const apiUrl = '/tg_bot_webhook'
const apiUrlAdmin = '/tgbot_admin_webhook'

const ppServerBase = 'https://ppeshoapi-7097239392.asia-south2.run.app'
const serverBase = 'https://api.esho.uz'

const fullNgrokUrl = `https://${ngrokUrl}.ngrok-free.app`
// есть два вида бота
//- клиентский бот
//-- дев
//-- прод
//- админский бот
//-- пока один
const links:Links = {
    'подключить медитация-клиент бот (прод) к Апи':{
        BOT_TOKEN:process.env.MEDITATION_BOT_TOKEN || '',
        SERVER_URL:serverBase,
        apiURL:apiUrl+'?mode=meditation',
    },
    'подключить медитация-клиент бот (прод) к ngrok':{
        BOT_TOKEN:process.env.MEDITATION_BOT_TOKEN || '',
        SERVER_URL:fullNgrokUrl,
        apiURL:apiUrl+'?mode=meditation',
    },

    'подключить админ бот к Апи':{
        BOT_TOKEN:process.env.ADMIN_TGBOT_TOKEN || '',
        SERVER_URL:serverBase,
        apiURL:apiUrlAdmin,
    },
     'подключить админ бот к ппАпи':{
        BOT_TOKEN:process.env.ADMIN_TGBOT_TOKEN || '',
        SERVER_URL:ppServerBase,
        apiURL:apiUrlAdmin,
    },
     'подключить админ бот к ngrok':{
        BOT_TOKEN:process.env.ADMIN_TGBOT_TOKEN || '',
        SERVER_URL:fullNgrokUrl,
        apiURL:apiUrlAdmin,
    },

    'подключить мастермайнд-клиент бот (дев) к ппАпи':{
        BOT_TOKEN:process.env.BOT_TOKEN || '',
        SERVER_URL:ppServerBase,
        apiURL:apiUrl+'?mode=mastermind',
    },
    'подключить мастермайнд-клиент бот (дев) к ngrok':{
        BOT_TOKEN:process.env.BOT_TOKEN || '',
        SERVER_URL:fullNgrokUrl,
        apiURL:apiUrl+'?mode=mastermind',
    },

    'подключить мастермайнд-клиент бот ПРОД к Апи':{
        BOT_TOKEN:process.env.PROD_BOT_TOKEN || '',
        SERVER_URL:serverBase,
        apiURL:apiUrl+'?mode=mastermind',
    },
   
    
   
}   

//подключение к ПП
// setWebhook2('подключить клиент бот (дев) к ппАпи',links);
// setWebhook2('подключить админ бот к ппАпи',links);
//к ngrok
// setWebhook2('подключить мастермайнд-клиент бот (дев) к ngrok',links);
// setWebhook2('подключить админ бот к ngrok',links);

//подключение продакшена
// setWebhook2('подключить клиент бот (прод) к Апи',links);
// setWebhook2('подключить админ бот к Апи',links);

// setWebhook2('подключить медитация-клиент бот (прод) к ngrok',links);
// setWebhook2('подключить медитация-клиент бот (прод) к Апи',links);

setWebhook2('подключить мастермайнд-клиент бот ПРОД к Апи',links);

