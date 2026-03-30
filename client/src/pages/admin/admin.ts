import type { Page } from '../../types';
import "./admin.scss";

function updateStatus() {
    const isDebug = localStorage.getItem('no_analytics') === 'true';
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.innerText = isDebug ? 'ЗАБЛОКИРОВАНО' : 'РАБОТАЕТ';
        statusElement.style.color = isDebug ? 'red' : 'green';
    }
}

function enableDebug() {
    localStorage.setItem('no_analytics', 'true');
    updateStatus();

}

function disableDebug() {
    localStorage.removeItem('no_analytics');
    updateStatus();
}
export const adminPage: Page = () => {
  return {
    html: `
    <div class="admin">
      <h1>Управление статистикой</h1>
<p class="status">Текущий статус: <strong id="status">проверка...</strong></p>

      <button class="btn_big">Включить режим разработчика (Блокировать GTM/Pixel)</button>
      <button class="btn_big">Выключить режим разработчика (Разрешить отправку)</button>      
    </div>
    `,
    init() {
      const btn1 = document.querySelector('button:nth-of-type(1)');
      const btn2 = document.querySelector('button:nth-of-type(2)');
      if (btn1) btn1.addEventListener('click', enableDebug);
      if (btn2) btn2.addEventListener('click', disableDebug);
      updateStatus();
      
    },
    title: 'Админ'
  };
}
