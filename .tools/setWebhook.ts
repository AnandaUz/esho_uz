import '../_base/server/config';
import { setWebhook2, Links } from "../_base/.tools/setWebhook";


const ngrokUrl = 'a1c5-92-253-192-234'

const apiUrl = '/tg_bot_webhook'
const apiUrlAdmin = '/tgbot_admin_webhook'
const localServerUrl = 'http://localhost:8080'


const ppServerBase = 'https://ppeshoapi-7097239392.asia-south2.run.app'

const fullNgrokUrl = `https://${ngrokUrl}.ngrok-free.app`
// есть два вида бота
//- клиентский бот
//-- дев
//-- прод
//- админский бот
//-- пока один
const links:Links = {
    'подключить клиент бот (дев) к ппАди':{
        BOT_TOKEN:process.env.BOT_TOKEN || '',
        SERVER_URL:ppServerBase,
        apiURL:apiUrl,
    },
    'подключить админ бот к ппАди':{
        BOT_TOKEN:process.env.ADMIN_TGBOT_TOKEN || '',
        SERVER_URL:ppServerBase,
        apiURL:apiUrlAdmin,
    },
    'подключить клиент бот (дев) к ngrok':{
        BOT_TOKEN:process.env.BOT_TOKEN || '',
        SERVER_URL:fullNgrokUrl,
        apiURL:apiUrl,
    },
    'подключить админ бот к ngrok':{
        BOT_TOKEN:process.env.ADMIN_TGBOT_TOKEN || '',
        SERVER_URL:fullNgrokUrl,
        apiURL:apiUrlAdmin,
    },
    prod:{
        BOT_TOKEN:'',
        SERVER_URL:'https://api.esho.uz',
        apiURL:apiUrl,

    },
    preprod:{
        BOT_TOKEN:'',
        SERVER_URL:'https://ppeshoapi-7097239392.asia-south2.run.app',
        apiURL:apiUrl,

    },
    local:{
        BOT_TOKEN:'',
        SERVER_URL:localServerUrl,
        apiURL:apiUrl,

    },
    adminBot:{
        BOT_TOKEN:'',
        SERVER_URL:'https://ppeshoapi-7097239392.asia-south2.run.app',
        apiURL:apiUrlAdmin,
    },
    adminBot_toLocal:{
        BOT_TOKEN:process.env.ADMIN_TGBOT_TOKEN || '',
        SERVER_URL:fullNgrokUrl,
        apiURL:apiUrlAdmin,
    },
    ppBot_toLocal:{
        BOT_TOKEN:process.env.BOT_TOKEN || '',
        SERVER_URL:fullNgrokUrl,
        apiURL:apiUrl,
    }
}   

//подключение к ПП
setWebhook2('подключить клиент бот (дев) к ппАди',links);
setWebhook2('подключить админ бот к ппАди',links);
//к ngrok
// setWebhook2('подключить клиент бот (дев) к ngrok',links);
// setWebhook2('подключить админ бот к ngrok',links);