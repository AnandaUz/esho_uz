import '@base/shared/server/config';
import { setWebhook, WebhookConfig } from "@base/shared/.tools/setWebhook";


const apiUrl = '/tg_bot_webhook'
const apiUrlAdmin = '/tgbot_admin_webhook'
const localServerUrl = 'http://localhost:8080'
const ngrokUrl = '446e-92-253-192-234'

const fullNgrokUrl = `https://${ngrokUrl}.ngrok-free.app`


const webhookConfig: WebhookConfig = {
    // mode: 'local',
    // mode: 'preprod',
    // mode: 'prod',
    // mode: 'adminBot_toLocal',
    // mode: 'ppBot_toLocal',   
    mode: 'adminBot_toProd',

    data:{
        prod:{
            BOT_TOKEN:'',
            SERVER_URL:'https://api.esho.uz',
            apiURL:apiUrl,
            title:'prod'
        },
        preprod:{
            BOT_TOKEN:'',
            SERVER_URL:'https://ppeshoapi-7097239392.asia-south2.run.app',
            apiURL:apiUrl,
            title:'preprod'
        },
        local:{
            BOT_TOKEN:'',
            SERVER_URL:localServerUrl,
            apiURL:apiUrl,
            title:'local'
        },
        adminBot:{
            BOT_TOKEN:'',
            SERVER_URL:'https://ppeshoapi-7097239392.asia-south2.run.app',
            apiURL:apiUrlAdmin,
            title:'adminBot'
        },
        adminBot_toLocal:{
            BOT_TOKEN:process.env.ADMIN_TGBOT_TOKEN || '',
            SERVER_URL:fullNgrokUrl,
            apiURL:apiUrlAdmin,
            title:'adminBot_toLocal'
        },
        adminBot_toProd:{
            BOT_TOKEN:process.env.ADMIN_TGBOT_TOKEN || '',
            SERVER_URL:'https://api.esho.uz',
            apiURL:apiUrlAdmin,
            title:'adminBot_toProd'
        },
        ppBot_toLocal:{
            BOT_TOKEN:process.env.BOT_TOKEN || '',
            SERVER_URL:fullNgrokUrl,
            apiURL:apiUrl,
            title:'ppBot_toLocal'
        }
    }   
    
}
setWebhook(webhookConfig);



