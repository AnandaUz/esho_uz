import { sendTrackingEvent } from "@/main";


export class CAnhToBot extends HTMLElement {   
  private botUrl = import.meta.env.VITE_BOT_URL;

  async connectedCallback() {
    const attr = this.getAttribute('data-attr') || 'f1';
    const btnText = this.getAttribute('btn-text') || 'Отправить';
     this.innerHTML = `
     <a href="${this.botUrl}?start=${attr}"
               class="btn btn-meet"
               target="_blank"
               onclick="fbq('track', 'Lead', {value: 1.00, currency: 'USD', content_name: 'meet_btn1'});">
                ${btnText}
            </a>
     `
    this.querySelector('a')?.addEventListener('click', () => {
      sendTrackingEvent(`btn_${attr}`);
    });
  }
}
customElements.define('c-anh-to_bot', CAnhToBot);