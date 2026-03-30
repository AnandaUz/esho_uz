import '@styles/style.scss'
import { render } from './router';

import { renderHeader } from './components/header'; // добавить
import { renderFooter } from './components/footer'; // добавить




async function init() {
  renderHeader();
  renderFooter();
  render();
}
init();

document.addEventListener('click', (e) => {
  const target = e.target as HTMLAnchorElement;
  
  if (target.tagName === 'A' && target.href.startsWith(window.location.origin)) {
    e.preventDefault();
    history.pushState({}, '', target.href);    
  }
});

// Обрабатываем кнопки браузера "назад" / "вперёд"
window.addEventListener('popstate', () => {
  
});
