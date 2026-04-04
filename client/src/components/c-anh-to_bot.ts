import { getVisiterId, sendTrackingMessage } from "@/main";


export class CAnhToBot extends HTMLElement {   
  private botUrl = import.meta.env.VITE_BOT_URL;

  async connectedCallback() {
    const attr = this.getAttribute('data-attr') || 'f1';
    const btnText = this.getAttribute('btn-text') || 'Отправить';
    const classAttr = this.getAttribute('data-class') || '';
    this.innerHTML = `
     <a href="${this.botUrl}?start=${attr}"
               class="btn btn-meet "
               target="_blank"
               onclick="fbq('track', 'Lead', {value: 1.00, currency: 'USD', content_name: '${attr}_btn1'});">
                <span class="${classAttr}">${btnText}</span>
            </a>
     `

   
    
    this.querySelector('a')?.addEventListener('click', () => {
 const fbp = localStorage.getItem('fbp') || '';
    const fbc = localStorage.getItem('fbc') || '';
    const fbclid = localStorage.getItem('fbclid') || '';
    const message = `${getVisiterId()} 🔅 onStartBot
fbp:${fbp}
fbc:${fbc}
fbclid:${fbclid}`

      sendTrackingMessage(message);
    });
  }
}
customElements.define('c-anh-to_bot', CAnhToBot);