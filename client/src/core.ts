import "@styles/style.scss";
import "./main.ts";
import { render } from "./router";

import { renderHeader } from "./components/header"; // добавить
import { renderFooter } from "./components/footer"; // добавить

async function init() {
  renderHeader();
  renderFooter();
  await render();
}
init();

document.addEventListener("click", (e) => {
  const target = (e.target as HTMLElement).closest("a");
  if (!target) return;

  if (target.href.startsWith(window.location.origin)) {
    if (target.href.endsWith(".pdf") || target.target === "_blank") return;

    e.preventDefault();
    history.pushState({}, "", target.href);
    render();
  }
});

// Обрабатываем кнопки браузера "назад" / "вперёд"
window.addEventListener("popstate", () => {
  render();
});
