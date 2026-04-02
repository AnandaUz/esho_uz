const off_MyStat = localStorage.getItem('off_MyStat') === 'true';
const STORAGE_ID = 'good_visiter';

declare global {
  interface Window {
    timeStart: Date;
  }
}
if (!off_MyStat) {
    trackVisit();
    const timers = [
        { ms: 1000,  label: "1с" },  
        { ms: 5000, label: "5с" },
        { ms: 10000, label: "10с" },
        { ms: 30000, label: "30с" },
        { ms: 50000, label: "50с" }
    ];
    // 3. Запускаем циклом
    timers.forEach(timer => {
        setTimeout(() => sendTrackingEvent(timer.label), timer.ms);
    });

    // let scrollSent = false;
    let scrollTimer: ReturnType<typeof setTimeout>;

    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        sendTrackingEvent(`scroll ${scrollPercent}`);
      }, 300); // 500ms после остановки
    });
}

window.addEventListener("load", () => { });
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
function parseUserAgent(ua: string): { browser: string; version: string; os: string } {
  if (!ua) return { browser: 'Unknown', version: '', os: 'Unknown' };

  const browsers = [
    { name: 'Edge',            regex: /Edg\/([0-9.]+)/ },
    { name: 'Opera',           regex: /OPR\/([0-9.]+)/ },
    { name: 'Opera Legacy',    regex: /Opera\/([0-9.]+)/ },
    { name: 'Yandex Browser',  regex: /YaBrowser\/([0-9.]+)/ },
    { name: 'Samsung Browser', regex: /SamsungBrowser\/([0-9.]+)/ },
    { name: 'UC Browser',      regex: /UCBrowser\/([0-9.]+)/ },
    { name: 'Firefox',         regex: /Firefox\/([0-9.]+)/ },
    { name: 'Chrome',          regex: /Chrome\/([0-9.]+)/ },
    { name: 'Safari',          regex: /Version\/([0-9.]+).*Safari/ },
    { name: 'Safari',          regex: /Safari\/([0-9.]+)/ }, // fallback
  ];

  const osList = [
    { name: 'Windows 11/10', regex: /Windows NT 10\.0/ },
    { name: 'Windows 8.1',   regex: /Windows NT 6\.3/ },
    { name: 'Windows 8',     regex: /Windows NT 6\.2/ },
    { name: 'Windows 7',     regex: /Windows NT 6\.1/ },
    { name: 'macOS',         regex: /Mac OS X ([0-9_]+)/ },
    { name: 'iPhone (iOS)',  regex: /iPhone OS ([0-9_]+)/ },
    { name: 'iPad (iOS)',    regex: /iPad.*OS ([0-9_]+)/ },
    { name: 'Android',       regex: /Android ([0-9.]+)/ },
    { name: 'Linux',         regex: /Linux/ },
  ];

  let browser = 'Unknown', version = '';
  for (const b of browsers) {
    const match = ua.match(b.regex);
    if (match) {
      browser = b.name;
      version = match[1]?.split('.')[0] || '';
      break;
    }
  }

  let detectedOS = 'Unknown';
  for (const o of osList) {
    const match = ua.match(o.regex);
    if (match) {
      detectedOS = o.name;
      if (match[1]) detectedOS += ` ${match[1].replace(/_/g, '.')}`;
      break;
    }
  }

  return { browser, version, os: detectedOS };
}
function trackVisit() {
const timeEnd = new Date();
    const timeDiff = Math.round((timeEnd.getTime() - window.timeStart.getTime())/10)/100;
  if (isAlreadyTracked()) {
    
    sendTrackingEvent(`in ${timeDiff}`);
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid')?.slice(-6) || 'id-'+Math.random().toString(36).slice(7, 10);
  localStorage.setItem(STORAGE_ID, fbclid);    

  const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "📱" : "💻";
  const language = navigator.language || "";

  const now = new Date();
  const tashkentTime = new Date(now.getTime() + (5 * 60 * 60 * 1000));
  const dateStr = tashkentTime.toISOString()
    .replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}).*/, '$3.$2 $4:$5');

  const utm_campaign = params.get('utm_campaign');
  const key1 = params.get('key1');

  const rawParts = [utm_campaign, key1].filter(Boolean);
  const uniqueParts = [...new Set(rawParts)];
  const utmString = uniqueParts.join(" 🔅 ");

  const fbInfo = ` ${fbclid.slice(-6)}`;

  let marketingInfo = "";
  if (utmString || fbInfo) {
    marketingInfo = `\n🎯  ${utmString || "Без UTM"}${fbInfo ? `\n${fbInfo}` : ""}`;
  }

  const { browser, version, os } = parseUserAgent(navigator.userAgent);
  const browserName = `${browser}${version ? '-' + version : ''} ${os}`;

  const message = `${dateStr} ${isMobile} ${language} 🔸 ${browserName} 🔸 ${document.referrer || "🌸"} ${marketingInfo}
⏳ ${timeDiff}`;

  fetch(import.meta.env.VITE_API_URL + '/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
}
function getVisiterId() {
  if (!localStorage.getItem(STORAGE_ID)) {
    trackVisit();
  }
  return localStorage.getItem(STORAGE_ID)
}
function isAlreadyTracked(): boolean {
    const str = localStorage.getItem(STORAGE_ID)
    if (str) return true; 
    return false; 
}





