import { getCookie, getVisiterId, sendTrackingMessage } from "@/main";


export class CAnhToBot extends HTMLElement {   
  private botUrl = import.meta.env.VITE_BOT_URL;

  async connectedCallback() {
    const attr = this.getAttribute('data-attr') || 'f1';
    const btnText = this.getAttribute('btn-text') || 'Отправить';
    const classAttr = this.getAttribute('data-class') || '';
    let userID = localStorage.getItem('good_visiter') || '';
    if (userID) {
      userID = '__'+userID
    }
    this.innerHTML = `
     <a href="${this.botUrl}?start=${attr}${userID}"
               class="btn btn-meet "
               target="_blank"
               onclick="fbq('track', 'Lead', {value: 1.00, currency: 'USD', content_name: '${attr}_btn1'});">
                <span class="${classAttr}">${btnText}</span>
            </a>
     `

   
    
    this.querySelector('a')?.addEventListener('click', () => {
    const fbp = getCookie('_fbp')
    const fbc = getCookie('_fbc')
        
    const message = `${getVisiterId()} 🚀🚀🚀 on StartBot 🚀🚀🚀
fbp:${fbp}
fbc:${fbc}`

      sendTrackingMessage(message);
    });
  }
}
customElements.define('c-anh-to_bot', CAnhToBot);