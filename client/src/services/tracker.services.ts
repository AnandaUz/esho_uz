import type { IGuest } from "@shared/types/IGuest";
import { parseUserAgent, getCookie } from "./tracker.tools";

const API_URL = 'https://ishvara-api-7097239392.europe-west1.run.app' + '/api/tracker';
// const API_URL = 'http://localhost:8080' + '/api/tracker';
// const off_MyStat = localStorage.getItem('off_MyStat') === 'true';
const STORAGE_ID = 'guestID';

// http://localhost:5173/meditation?comp_name=MeditationTashkent&adset_name=contact&ad_name=v-meditation-0
// utm_source=inst&utm_campaign=lead&utm_content=s_interesami&key1=video0

//const path = 

const EVENT_CODE = {
  scroll0:1,
  scroll1:2,
  scroll2:3,
  scroll3:4,
  scroll4:5,
  scroll5:6,
  scroll6:7,
  inPage:8,
  outPage:9,
  goalBtnClick:10,

} as const

type TEventItem = [number, number|string]
class Guest {
  private _id: string | null = null;

  private data: IGuest | null = null;
  startTime: Date;
  events: TEventItem[] = [];
  scrollLever:number = 0;
  

  constructor() {
    this.startTime = new Date();
    
    setInterval(() => this.flush(), 2_000)

// // При уходе со страницы — надёжно на мобильных
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.track(EVENT_CODE.outPage);
        this.flush(new Date())
      }
    })
    this.setBaseEvents();
    this.track(EVENT_CODE.inPage);
  }
  setBaseEvents() {
    window.addEventListener('scroll', () => {
      let i = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
      i = Math.ceil(i*6/100);

      if (i !== this.scrollLever) {
        this.scrollLever = i;
       this.track(EVENT_CODE[`scroll${i}` as keyof typeof EVENT_CODE]);
        // console.log(i);
      }        
    });
    let count = 0;
    const checkFbq = setInterval(() => {
        count++;        

        const isPixel = typeof (window as any).fbq == 'function';
        const fbp = getCookie('_fbp')
        const fbc = getCookie('_fbc')       
        
        
        if (fbp || fbc) {
          const result: Record<string, string> = {}
          if (fbp) result.fbp = fbp;
          if (fbc) result.fbc = fbc;
          if (isPixel) result.pixel = 'true';          
    
          if (this._id) {
            navigator.sendBeacon(
              API_URL + '/save-cookies',
              new Blob([JSON.stringify({ _id: this._id, result })], { type: 'application/json' }))
              clearInterval(checkFbq);
          }
        }
        if (count > 10) {
            clearInterval(checkFbq);
            
        }
    }, 1000);

    
  }
  async init() {      
    // if (off_MyStat) {
    //   console.log('off_MyStat is true');
    //   return;
    // }

    // 1. Проверяем, нет ли уже ID в sessionStorage
    this._id = localStorage.getItem(STORAGE_ID);
    if (this._id) return this._id;
    
    const urlParams = new URLSearchParams(window.location.search);      

    const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? true : false;   

    const { browser, version, os } = parseUserAgent(navigator.userAgent);      
    
    this.data = {
      _id: '',
      createdAt: new Date(),
      ua: `${browser}${version ? '-' + version : ''}${os}`,
      isMobile: isMobile,
    } as IGuest

    // сохраняем от куда пришёл
    if (document.referrer) {
      const url = new URL(document.referrer)
      this.data.referrer = url.pathname  // → "/meditation"
    }
    
    this.data.instagram = {
        
    }
    const inst = this.data.instagram;
    const comp_name = urlParams.get('comp_name');
    const adset_name = urlParams.get('adset_name');
    const ad_name = urlParams.get('ad_name');
    if (comp_name) inst.comp_name = comp_name;
    if (adset_name) inst.adset_name = adset_name;
    if (ad_name) inst.ad_name = ad_name;

    const utm_campaign = urlParams.get('utm_campaign');
    if (utm_campaign === 'lead') {
      inst.comp_name = 'lead';
      inst.adset_name = 'lead-with-interests';        
      const key1 = urlParams.get('key1');        
      if (key1) inst.ad_name = key1;
    }  
    this.data.paramsString = window.location.search;

    // console.log(this.data);
    // return
    
    try {
    // 4. Запрашиваем создание сессии
    const response = await fetch(API_URL + '/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.data),
    });

    if (!response.ok) throw new Error('Failed to init session');

    const data = await response.json();
    
    // 5. Сохраняем полученный от Монго ID
    if (data._id) {
          localStorage.setItem(STORAGE_ID, data._id);
          return data._id;
    }
    } catch (err) {
    console.error('Session init error:', err);
    return null;
    }
  }
  track(code: number) {
    const sec = Math.round((Date.now() - this.startTime.getTime()) / 100)/10
    if (code === EVENT_CODE.inPage) {
      this.events.push([sec, window.location.pathname])
      return;
    }
    
    this.events.push([sec, code])
  }
  flushForData(url:string,data:any) {
    if (!this._id) return;
    
    navigator.sendBeacon(
      API_URL + url,
      new Blob([JSON.stringify({ _id: this._id, data })], { type: 'application/json' })
    )
  }  
    // отправляем накопленное и чистим
  flush(lastChange:Date|null=null) {
    if (this.events.length === 0) return
    
    const payload = [...this.events]  // копия
    this.events = []                  // очищаем сразу
    

    if (!this._id) {
      this.init();
    }
    navigator.sendBeacon(
      API_URL + '/push-events',
      new Blob([JSON.stringify({ _id: this._id, events: payload, lastChange })], { type: 'application/json' })
    )
  }  
}
const guest = new Guest();
(window as any).guest = guest;

(window as any).guestTrack = (code:number | string)=>{
  if (typeof code === 'string') {
    code = EVENT_CODE[code as keyof typeof EVENT_CODE];
  }
  guest.track(code);
}
export default guest;


/*
export async function sendTrackingEvent(eventName: string):Promise<boolean> {   
    const page_path = window.location.pathname;
    const message = `${getVisiterId()} 🔅 ${eventName} 🔅 ${page_path}`
    await fetch(import.meta.env.VITE_API_URL + '/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({message})
    }).catch(err =>  {
      console.log('Tracking error:', err);
      return false;
    });
    return true;
}
export async function sendTrackingMessage(message: string):Promise<boolean> {       
    await fetch(import.meta.env.VITE_API_URL + '/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({message})
    }).catch(err =>  {
      console.log('Tracking error:', err);
      return false;
    });
    return true;
}
export async function sendMessageToAdmin(message: string):Promise<boolean> {       
    await fetch(import.meta.env.VITE_API_URL + '/track_admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({message})
    }).catch(err =>  {
      console.log('Tracking error:', err);
      return false;
    });
    return true;
}




{

    let count = 0;
    
}
*/







