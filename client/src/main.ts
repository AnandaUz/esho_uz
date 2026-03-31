const off_MyStat = localStorage.getItem('off_MyStat') === 'true';
const STORAGE_ID = 'good_visiter'
window.addEventListener("load", () => {  
     
    const meetForm = document.getElementById('meetForm') as HTMLFormElement | null;
    const formMessage = document.getElementById('formMessage') as HTMLElement | null;

    if (meetForm && formMessage) {
        meetForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(meetForm);
            const data = {
                userName: formData.get('userName'),
                userContact: formData.get('userContact')
            };

            try {
                const response = await fetch(import.meta.env.VITE_API_URL + '/api/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (typeof window.fbq === 'function') {
                    fbq('track', 'Lead', {value: 1.00, currency: 'USD', content_name: 'meet_form'});
                }

                if (result.success) {
                    meetForm.style.display = 'none';
                    formMessage.style.display = 'block';
                } else {
                    alert('Произошла ошибка при отправке заявки. Попробуйте еще раз.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Произошла ошибка при отправке заявки.');
            }
        });
    }
    if (!off_MyStat) {
        trackVisit();
        const timers = [
            { ms: 1000,  label: "1с" },
            { ms: 3000, label: "3с" },
            { ms: 5000, label: "5с" },
            { ms: 10000, label: "10с" },
            { ms: 30000, label: "30с" },
            { ms: 50000, label: "50с" }
        ];
        // 3. Запускаем циклом
        timers.forEach(timer => {
            setTimeout(() => sendTrackingEvent(timer.label), timer.ms);
        });

        let scrollSent = false;
        window.addEventListener('scroll', function() {
            if (scrollSent) return; // Если уже отправили, выходим
            scrollSent = true;
            sendTrackingEvent("scroll");
        });
    }
    
});
function sendTrackingEvent(eventName: string) {   
    const page_path = window.location.pathname;
    const message = `${getVisiterId()} 🔅 ${eventName} 🔅 ${page_path}`
    fetch(import.meta.env.VITE_API_URL + '/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({message})
    }).catch(err => console.log('Tracking error:', err));
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

    if (isAlreadyTracked()) return;
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid') || 'кто-то';
  sessionStorage.setItem(STORAGE_ID, fbclid);    

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

  const message = `${dateStr} ${isMobile} ${language} 🔸 ${browserName} 🔸 ${document.referrer || "🌸"} ${marketingInfo}`;

  fetch(import.meta.env.VITE_API_URL + '/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
}
function getVisiterId() {
    return sessionStorage.getItem(STORAGE_ID)
}
function isAlreadyTracked(): boolean {
    const str = sessionStorage.getItem(STORAGE_ID)
    if (str) return true; 
    return false; 
}





