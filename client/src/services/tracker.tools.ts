export function parseUserAgent(ua: string): { browser: string; version: string; os: string } {
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
export function getCookie(name: string): string {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match && match[2] ? match[2] : '';
}