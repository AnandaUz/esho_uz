

async function initSession() {
  // 1. Проверяем, нет ли уже ID в sessionStorage
  let clientID = localStorage.getItem('clientID');
  if (clientID) return clientID;

  // 3. Достаем параметры из URL (для таргета)
  const urlParams = new URLSearchParams(window.location.search);

  const payload = {
    instagram: {
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
      // Эти параметры часто передаются в UTM или напрямую из рекламы
      comp_name: urlParams.get('utm_campaign') || urlParams.get('campaign_name'),
      adset_name: urlParams.get('utm_adset') || urlParams.get('adset_name'),
      ad_name: urlParams.get('utm_ad') || urlParams.get('ad_name'),
    }
  };

  try {
    // 4. Запрашиваем создание сессии
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to init session');

    const data = await response.json();
    
    // 5. Сохраняем полученный от Монго ID
    if (data._id) {
      localStorage.setItem('clientID', data._id);
      return data._id;
    }
  } catch (err) {
    console.error('Session init error:', err);
    return null;
  }
}

export default initSession;